const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Listing = require('../models/Listing');
const User = require('../models/User');

// Helper function to calculate distance between coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(1));
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
exports.getListings = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };
  const { lat, lng } = req.query;
  const userLocation = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null;

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'query', 'lat', 'lng'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Listing.find(JSON.parse(queryStr))
    .populate({
      path: 'location',
      select: 'name city state'
    })
    .populate({
      path: 'owner',
      select: 'name email phone'
    });

  // Handle search query
  if (req.query.query) {
    const searchQuery = req.query.query;
    query = query.or([
      { title: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } }
    ]);
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Listing.countDocuments(query.getQuery());

  query = query.skip(startIndex).limit(limit);

  // Executing query
  let listings = await query;

  // Add distance if user location is provided
  if (userLocation) {
    // First convert all mongoose documents to plain objects
    listings = listings.map(listing => listing.toObject());
    
    // Then calculate distances for all listings
    listings = listings.map(listing => {
      if (listing.location && listing.location.coordinates && listing.location.coordinates.length === 2) {
        const listingCoords = {
          lat: listing.location.coordinates[1],
          lng: listing.location.coordinates[0]
        };
        
        listing.distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          listingCoords.lat,
          listingCoords.lng
        );
      } else {
        listing.distance = Infinity; // Use Infinity instead of null for better sorting
      }
      
      return listing;
    });

    // Sort by distance if requested
    if (req.query.sort === 'distance') {
      listings.sort((a, b) => {
        return a.distance - b.distance; // Infinity will always be sorted last
      });
    }
  }

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: listings.length,
    pagination,
    total,
    data: listings
  });
});

// ============================================
// NEW ENDPOINTS - MongoDB Topics Demonstration
// ============================================

// @desc    Get nearby listings using MongoDB geospatial queries
// @route   GET /api/listings/nearby
// @access  Public
// 
// Topics Demonstrated:
// - Topic #21: Geospatial Indexes (2dsphere)
// - Topic #22: $geoNear Query Operator
// - More efficient than client-side Haversine calculation
exports.getNearbyListings = asyncHandler(async (req, res, next) => {
  const { lng, lat, maxDistance = 5000, limit = 20 } = req.query;

  if (!lng || !lat) {
    return next(new ErrorResponse('Please provide longitude and latitude', 400));
  }

  const longitude = parseFloat(lng);
  const latitude = parseFloat(lat);

  // Topic #22: $geoNear operator uses 2dsphere index (Topic #21)
  // Benefits:
  // - Automatically sorted by distance
  // - Efficient with index
  // - Returns distance field automatically
  // - More efficient than client-side calculation
  
  const nearbyListings = await Listing.aggregate([
    {
      // Topic #22: $geoNear stage - Geospatial near query
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        distanceField: 'distance',      // Add distance field to results
        maxDistance: parseInt(maxDistance),  // Max distance in meters
        spherical: true                  // Use spherical geometry
      }
    },
    // Topic #26: $match - Filter active listings only
    {
      $match: { active: true }
    },
    // Topic #26: $limit - Limit results
    {
      $limit: parseInt(limit)
    },
    // Populate owner details
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner'
      }
    },
    {
      $unwind: {
        path: '$owner',
        preserveNullAndEmptyArrays: true
      }
    }
  ]);

  res.status(200).json({
    success: true,
    count: nearbyListings.length,
    data: nearbyListings
  });
});

// @desc    Advanced search with multiple query operators
// @route   GET /api/listings/search/advanced
// @access  Public
// 
// Topics Demonstrated:
// - Topic #8: Comparison Operators ($gt, $lt, $gte, $lte, $eq, $in)
// - Topic #10: Logical Operators ($and, $or)
// - Topic #11: Element Operators ($exists, $ne)
// - Topic #12: Array Operators ($elemMatch)
// - Topic #16: Text Indexes with $text operator
// - Topic #26: Pagination with $skip and $limit
exports.advancedSearch = asyncHandler(async (req, res, next) => {
  const {
    minPrice,
    maxPrice,
    propertyType,
    sharing,
    city,
    verified,
    furnished,
    hasAmenity,
    gender,
    page = 1,
    limit = 10,
    sort = '-createdAt',
    searchText
  } = req.query;

  const query = {};

  // Topic #11: $exists - Check if field exists
  query.active = true;

  // Topic #8: Comparison operators - Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseInt(minPrice);  // Topic #8: $gte
    if (maxPrice) query.price.$lte = parseInt(maxPrice);  // Topic #8: $lte
  }

  // Topic #8: $in operator - Multiple property types
  if (propertyType) {
    const types = propertyType.split(',');
    query.propertyType = { $in: types };  // Topic #8: $in
  }

  // Topic #10: $or operator - Multiple cities
  if (city) {
    const cities = city.split(',');
    query.$or = cities.map(c => ({ 'location.city': c }));  // Topic #10: $or
  }

  // Topic #11: Element operators
  if (verified === 'true') {
    query.verified = { $eq: true };  // Topic #8: $eq (explicit)
  }

  if (furnished) {
    query.furnishingStatus = { $in: furnished.split(',') };
  }

  // Topic #12: $elemMatch - Query array of embedded documents
  if (sharing) {
    const sharingOptions = sharing.split(',');
    query.floors = {
      $elemMatch: {
        rooms: {
          $elemMatch: {
            sharingOptions: { $in: sharingOptions }  // Topic #8: $in within $elemMatch
          }
        }
      }
    };
  }

  // Topic #11: $exists - Check for amenities
  if (hasAmenity) {
    query.amenities = {
      $exists: true,  // Topic #11: $exists
      $ne: []         // Not empty array
    };
  }

  // Topic #16: Text search with $text operator
  let textQuery = null;
  if (searchText) {
    textQuery = { $text: { $search: searchText } };  // Topic #16: $text operator
  }

  // Combine with text search if present
  let searchQuery = Listing.find(query);
  if (textQuery) {
    searchQuery = searchQuery.find(textQuery);
  }

  // Topic #26: Pagination with $skip and $limit
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const listings = await searchQuery
    .populate('owner', 'name email phone')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Listing.countDocuments(query);

  // Pagination info
  const pagination = {};
  if (skip + parseInt(limit) < total) {
    pagination.next = { page: parseInt(page) + 1, limit: parseInt(limit) };
  }
  if (skip > 0) {
    pagination.prev = { page: parseInt(page) - 1, limit: parseInt(limit) };
  }

  res.status(200).json({
    success: true,
    count: listings.length,
    total,
    pagination,
    data: listings
  });
});

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
exports.getListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: 'location',
      select: 'name city state'
    })
    .populate({
      path: 'owner',
      select: 'name email phone createdAt'
    });

  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: listing
  });
});

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Owner, Admin)
exports.createListing = asyncHandler(async (req, res, next) => {
  // Add owner to req.body
  req.body.owner = req.user.id;

  // Generate title if not provided
  if (!req.body.title) {
    req.body.title = `${req.body.name} - ${req.body.propertyType}`;
  }

  // Format location data
  if (req.body.latitude && req.body.longitude) {
    req.body.location = {
      type: 'Point',
      coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
      city: req.body.city,
      state: req.body.state,
      country: 'India' // Default country
    };
  }

  // Format floors data
  if (req.body.floors) {
    // Ensure floors is properly structured with rooms data
    req.body.floors = req.body.floors.map(floor => {
      const floorObj = {
        floorId: floor.floorId || `floor_${Math.random().toString(36).substring(2, 10)}`,
        numberOfRooms: floor.numberOfRooms || 0,
        active: typeof floor.active === 'boolean' ? floor.active : true,
        rooms: []
      };

      // Process rooms for this floor
      if (floor.rooms && Array.isArray(floor.rooms)) {
        floorObj.rooms = floor.rooms.map(room => {
          // Process price fields ensuring they are numbers
          let price = null;
          if (room.price !== undefined && room.price !== null) {
            price = parseFloat(room.price);
            if (isNaN(price)) price = null;
          }
          
          let discountedPrice = null;
          if (room.discountedPrice !== undefined && room.discountedPrice !== null) {
            discountedPrice = parseFloat(room.discountedPrice);
            if (isNaN(discountedPrice)) discountedPrice = null;
          }
          
          return {
            roomId: room.roomId || `room_${Math.random().toString(36).substring(2, 10)}`,
            type: room.type || 'standard',
            sharingOptions: room.sharingOptions || [],
            targetTenants: room.targetTenants || '',
            price: price,
            discountedPrice: discountedPrice,
            photos: room.photos || []
          };
        });
      }

      return floorObj;
    });
  }

  const listing = await Listing.create(req.body);

  res.status(201).json({
    success: true,
    data: listing
  });
});

// Helper function to sync tenants
const syncTenantsWithUsers = async (listing) => {
  // Get all existing tenant assignments from the listing
  const existingTenantAssignments = new Map();
  listing.floors.forEach(floor => {
    floor.rooms.forEach(room => {
      if (room.tenants && Array.isArray(room.tenants)) {
        room.tenants.forEach(tenant => {
          if (tenant.userId) {
            existingTenantAssignments.set(tenant.userId.toString(), {
              floorId: floor.floorId,
              roomId: room.roomId
            });
          }
        });
      }
    });
  });

  // Update User model for all tenants
  const userUpdatePromises = [];
  
  // Remove currentRoom from users who are no longer tenants
  const allCurrentTenants = Array.from(existingTenantAssignments.keys());
  userUpdatePromises.push(
    User.updateMany(
      { 
        'currentRoom.listingId': listing._id,
        _id: { $nin: allCurrentTenants }
      },
      { $unset: { currentRoom: "" } }
    )
  );

  // Update currentRoom for current tenants
  existingTenantAssignments.forEach((assignment, userId) => {
    userUpdatePromises.push(
      User.findByIdAndUpdate(
        userId,
        {
          currentRoom: {
            listingId: listing._id,
            floorId: assignment.floorId,
            roomId: assignment.roomId,
            assignedAt: Date.now()
          }
        },
        { new: true }
      )
    );
  });

  await Promise.all(userUpdatePromises);
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (Owner, Admin)
exports.updateListing = asyncHandler(async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is listing owner or admin
  if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this listing`,
        403
      )
    );
  }

  // Format location data if provided
  if (req.body.latitude && req.body.longitude) {
    req.body.location = {
      type: 'Point',
      coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
      city: req.body.city || listing.location.city,
      state: req.body.state || listing.location.state,
      country: 'India'
    };
  }

  // Process floors data if provided
  if (req.body.floors) {
    req.body.floors = req.body.floors.map(floor => {
      // Process rooms array if it exists
      if (floor.rooms && Array.isArray(floor.rooms)) {
        floor.rooms = floor.rooms.map(room => {
          // Process price fields ensuring they are numbers
          if (room.price !== undefined) {
            const price = parseFloat(room.price);
            if (!isNaN(price)) {
              room.price = price;
            }
          }
          
          if (room.discountedPrice !== undefined) {
            const discountedPrice = parseFloat(room.discountedPrice);
            if (!isNaN(discountedPrice)) {
              room.discountedPrice = discountedPrice;
            } else {
              // If not a valid number, remove the field
              delete room.discountedPrice;
            }
          }
          
          return room;
        });
      }
      
      return floor;
    });
  }

  // Update listing
  listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Sync tenants with users whenever the listing is updated
  await syncTenantsWithUsers(listing);

  res.status(200).json({
    success: true,
    data: listing
  });
});

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (Owner, Admin)
exports.deleteListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is listing owner or admin
  if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this listing`,
        403
      )
    );
  }

  // Get all tenants from the listing
  const tenantsToUpdate = [];
  listing.floors.forEach(floor => {
    floor.rooms.forEach(room => {
      if (room.tenants && room.tenants.length > 0) {
        tenantsToUpdate.push(...room.tenants.map(tenant => tenant.userId));
      }
    });
  });

  // Update all tenants to remove the specific currentRooms entry for this listing
  if (tenantsToUpdate.length > 0) {
    await User.updateMany(
      {
        _id: { $in: tenantsToUpdate }
      },
      {
        $pull: {
          currentRooms: {
            listingId: listing._id
          }
        }
      }
    );
  }

  // Delete the listing
  await Listing.deleteOne({ _id: listing._id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get featured listings
// @route   GET /api/listings/featured
// @access  Public
exports.getFeaturedListings = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 6;
  
  const listings = await Listing.find({ featured: true, active: true })
    .limit(limit)
    .populate({
      path: 'location',
      select: 'name city'
    });

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});

// @desc    Get owner listings
// @route   GET /api/listings/owner
// @access  Private (Owner, Admin)
exports.getOwnerListings = asyncHandler(async (req, res, next) => {
  const listings = await Listing.find({ owner: req.user.id })
    .populate({
      path: 'location',
      select: 'name city'
    });

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});

// @desc    Get capacity statistics for owner's properties
// @route   GET /api/listings/capacity
// @access  Private (Owner, Admin)
exports.getCapacityStats = asyncHandler(async (req, res, next) => {
  const listings = await Listing.find({ owner: req.user.id });
  
  let stats = {
    totalCapacity: 0,
    currentOccupancy: 0,
    roomTypeBreakdown: {
      single: 0,
      double: 0,
      triple: 0,
      fourSharing: 0
    },
    floorCount: 0,
    roomCount: 0
  };

  listings.forEach(listing => {
    if (listing.floors && Array.isArray(listing.floors)) {
      stats.floorCount += listing.floors.length;
      
      listing.floors.forEach(floor => {
        if (floor.rooms && Array.isArray(floor.rooms)) {
          stats.roomCount += floor.rooms.length;
          
          floor.rooms.forEach(room => {
            if (room.sharingOptions && Array.isArray(room.sharingOptions)) {
              // Get the first sharing option as that's how it's structured in the data
              const sharingOption = room.sharingOptions[0];
              
              // Calculate capacity based on sharing option
              switch(sharingOption) {
                case 'Single':
                  stats.totalCapacity += 1;
                  stats.roomTypeBreakdown.single += 1;
                  break;
                case 'Double':
                  stats.totalCapacity += 2;
                  stats.roomTypeBreakdown.double += 1;
                  break;
                case 'Triple':
                  stats.totalCapacity += 3;
                  stats.roomTypeBreakdown.triple += 1;
                  break;
                case '4 Sharing':
                  stats.totalCapacity += 4;
                  stats.roomTypeBreakdown.fourSharing += 1;
                  break;
                default:
                  // Try to parse number from the sharing option string
                  const match = sharingOption.match(/\d+/);
                  if (match) {
                    const num = parseInt(match[0]);
                    if (!isNaN(num)) {
                      stats.totalCapacity += num;
                      stats.roomTypeBreakdown.other += 1;
                    }
                  }
              }
            }
            
            // Calculate current occupancy
            if (room.tenants && Array.isArray(room.tenants)) {
              stats.currentOccupancy += room.tenants.length;
            }
          });
        }
      });
    }
  });

  res.status(200).json({
    success: true,
    data: {
      totalCapacity: stats.totalCapacity,
      currentOccupancy: stats.currentOccupancy,
      floorCount: stats.floorCount,
      roomCount: stats.roomCount,
      roomTypeBreakdown: stats.roomTypeBreakdown
    }
  });
});

// @desc    Toggle favorite listing
// @route   POST /api/listings/:id/favorite
// @access  Private
exports.toggleFavorite = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }

  const isFavorited = listing.favorites.includes(req.user.id);

  if (isFavorited) {
    // Remove from favorites
    const index = listing.favorites.indexOf(req.user.id);
    listing.favorites.splice(index, 1);
  } else {
    // Add to favorites
    listing.favorites.push(req.user.id);
  }

  await listing.save();

  res.status(200).json({
    success: true,
    data: {
      isFavorited: !isFavorited
    }
  });
});

// @desc    Get user's favorite listings
// @route   GET /api/listings/favorites
// @access  Private
exports.getUserFavorites = asyncHandler(async (req, res, next) => {
  const listings = await Listing.find({ favorites: req.user.id })
    .populate({
      path: 'location',
      select: 'name city'
    })
    .populate({
      path: 'owner',
      select: 'name'
    });

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});