const asyncHandler = require('../middleware/async');
const Listing = require('../models/Listing');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

/**
 * ANALYTICS CONTROLLER - MongoDB Aggregation Framework Demonstrations
 * 
 * Topics Demonstrated:
 * - Topic #25: Aggregation Framework - db.collection.aggregate()
 * - Topic #26: Pipeline Stages - $match, $sort, $limit, $skip
 * - Topic #27: Data Structuring - $group, $unwind, $bucket
 * - Topic #28: Accumulators - $sum, $avg, $max, $min, $push, $count
 */

// ============================================
// Endpoint 1: Dashboard Statistics
// Topics: $match, $group, $sum, $avg, $min, $max
// ============================================
/**
 * @desc    Get dashboard statistics aggregating listings data
 * @route   GET /api/analytics/dashboard
 * @access  Private/Admin
 * 
 * Demonstrates:
 * - $match stage: Filter active listings (Topic #26)
 * - $group stage: Group by property type (Topic #27)
 * - $sum accumulator: Count listings (Topic #28)
 * - $avg accumulator: Calculate average price (Topic #28)
 * - $min, $max: Price range (Topic #28)
 */
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const pipeline = [
    // Topic #26: $match - Filter only active listings
    {
      $match: {
        active: true
      }
    },
    // Topic #27: $group - Group by property type with multiple accumulators
    {
      $group: {
        _id: '$propertyType',                    // Group by property type
        
        // Topic #28: Accumulator Operators
        totalListings: { $sum: 1 },              // Count: Sum of 1 for each document
        avgPrice: { $avg: '$price' },            // Average: Calculate mean price
        minPrice: { $min: '$price' },            // Min: Minimum price
        maxPrice: { $max: '$price' },            // Max: Maximum price
        totalRooms: { $sum: { $size: '$floors' } }, // Count total rooms
        
        // Topic #28: $push - Collect all titles into array
        titles: { $push: '$title' }
      }
    },
    // Topic #26: $sort - Sort by count descending
    {
      $sort: { totalListings: -1 }
    }
  ];

  try {
    const stats = await Listing.aggregate(pipeline);
    
    // Calculate overall statistics
    const totalListings = stats.reduce((sum, stat) => sum + stat.totalListings, 0);
    const totalRooms = stats.reduce((sum, stat) => sum + (stat.totalRooms || 0), 0);
    const avgPrice = stats.reduce((sum, stat) => sum + (stat.avgPrice * stat.totalListings), 0) / totalListings || 0;
    const minPrice = Math.min(...stats.map(stat => stat.minPrice || Infinity));

    res.status(200).json({
      success: true,
      data: {
        totalListings,
        totalRooms,
        avgPrice: Math.round(avgPrice),
        minPrice: isFinite(minPrice) ? minPrice : 0,
        listingsByType: stats
      }
    });
  } catch (error) {
    next(new ErrorResponse('Error fetching dashboard stats', 500));
  }
});

// ============================================
// Endpoint 2: Listings by City Breakdown
// Topics: $group (nested), $sort, $limit, $skip
// ============================================
/**
 * @desc    Get listing count and price stats grouped by city
 * @route   GET /api/analytics/listings-by-city
 * @access  Private/Admin
 * 
 * Demonstrates:
 * - $match stage: Filter active listings
 * - $group stage: Group by nested field (city within location)
 * - Multiple accumulators: $sum, $avg, $first, $push
 * - $sort and $limit: Top N results
 */
exports.getListingsByCity = asyncHandler(async (req, res, next) => {
  const pipeline = [
    // Topic #26: $match - Filter active listings
    {
      $match: {
        active: true,
        'location.city': { $exists: true }  // Topic #11: $exists operator
      }
    },
    // Topic #27: $group - Group by city (nested field access)
    {
      $group: {
        _id: '$location.city',               // Group by city (nested field)
        totalListings: { $sum: 1 },          // Topic #28: $sum accumulator
        avgPrice: { $avg: '$price' },        // Topic #28: $avg accumulator
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        
        // Topic #28: $push - Collect property types
        propertyTypes: { $push: '$propertyType' },
        
        // Topic #28: $first - Get first listing title
        sampleListing: { $first: '$title' }
      }
    },
    // Topic #26: $sort - Sort by count descending
    {
      $sort: { totalListings: -1 }
    },
    // Topic #26: $limit - Top 10 cities
    {
      $limit: 10
    }
  ];

  try {
    const citiesData = await Listing.aggregate(pipeline);
    
    res.status(200).json({
      success: true,
      count: citiesData.length,
      data: citiesData
    });
  } catch (error) {
    next(new ErrorResponse('Error fetching city breakdown', 500));
  }
});

// ============================================
// Endpoint 3: Price Distribution (Histogram)
// Topics: $bucket, $group, $push accumulators
// ============================================
/**
 * @desc    Get listing distribution across price ranges
 * @route   GET /api/analytics/price-distribution
 * @access  Private/Admin
 * 
 * Demonstrates:
 * - $bucket stage: Categorize prices into ranges (Topic #27)
 * - Boundaries definition: Dynamic bucketing
 * - $push accumulator: Collect data into arrays
 * - $sum accumulator: Count in each bucket
 */
exports.getPriceDistribution = asyncHandler(async (req, res, next) => {
  const pipeline = [
    // Topic #26: $match - Filter active listings with prices
    {
      $match: {
        active: true,
        price: { $exists: true, $ne: null }  // Topic #11: $exists and $ne
      }
    },
    // Topic #27: $bucket - Categorize prices into ranges
    {
      $bucket: {
        groupBy: '$price',                   // Group by price field
        boundaries: [0, 5000, 10000, 15000, 20000, 50000],  // Price ranges
        default: '50000+',                   // Category for values outside boundaries
        output: {
          // Topic #28: Accumulators
          count: { $sum: 1 },                // Count listings in this bucket
          listings: { $push: {               // $push - Collect listing info
            title: '$title',
            price: '$price',
            city: '$location.city'
          }},
          avgPrice: { $avg: '$price' }       // Average in this bucket
        }
      }
    }
  ];

  try {
    const distribution = await Listing.aggregate(pipeline);
    
    res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    next(new ErrorResponse('Error fetching price distribution', 500));
  }
});

// ============================================
// Endpoint 4: Room Sharing Statistics
// Topics: $unwind, $group (nested arrays), multiple accumulators
// ============================================
/**
 * @desc    Get statistics on room sharing types with occupancy
 * @route   GET /api/analytics/room-sharing-stats
 * @access  Private/Admin
 * 
 * Demonstrates:
 * - $unwind stage: Deconstruct arrays (Topic #27)
 * - Double $unwind: For deeply nested arrays (floors → rooms)
 * - Topic #4: Array operations on nested documents
 * - $group with array counting: Topic #28
 */
exports.getRoomSharingStats = asyncHandler(async (req, res, next) => {
  const pipeline = [
    // Topic #26: $match - Filter active listings
    {
      $match: {
        active: true
      }
    },
    // Topic #27: $unwind - Expand floors array
    // Input: listings with floors array
    // Output: One document per floor
    {
      $unwind: '$floors'
    },
    // Topic #27: $unwind - Expand rooms array (nested within floors)
    // Now each room becomes a separate document
    {
      $unwind: '$floors.rooms'
    },
    // Topic #27: $group - Group by sharing options
    {
      $group: {
        _id: { $arrayElemAt: ['$floors.rooms.sharingOptions', 0] },  // First sharing option
        totalRooms: { $sum: 1 },               // Topic #28: $sum
        avgPrice: { $avg: '$floors.rooms.price' },  // Topic #28: $avg
        
        // Topic #28: Count occupied rooms by summing tenant array sizes
        occupiedRooms: {
          $sum: {
            $cond: [
              { $gt: [{ $size: '$floors.rooms.tenants' }, 0] },  // If tenants exist
              { $size: '$floors.rooms.tenants' },               // Sum tenant count
              0                                                   // Else 0
            ]
          }
        },
        
        // Topic #28: $push - Collect room details
        rooms: { $push: {
          price: '$floors.rooms.price',
          tenantCount: { $size: '$floors.rooms.tenants' }
        }}
      }
    },
    // Topic #26: $sort - Sort by count descending
    {
      $sort: { totalRooms: -1 }
    }
  ];

  try {
    const sharingStats = await Listing.aggregate(pipeline);
    
    res.status(200).json({
      success: true,
      data: sharingStats
    });
  } catch (error) {
    next(new ErrorResponse('Error fetching room sharing stats', 500));
  }
});

// ============================================
// Endpoint 5: Popular Locations Analysis
// Topics: $group, $sort, $limit, $count stage
// ============================================
/**
 * @desc    Get most popular locations with listing counts
 * @route   GET /api/analytics/popular-locations
 * @access  Public
 * 
 * Demonstrates:
 * - $group: Group by nested location
 * - Topic #26: $limit pagination
 * - Topic #28: Multiple accumulators
 */
exports.getPopularLocations = asyncHandler(async (req, res, next) => {
  const pipeline = [
    {
      $match: {
        active: true,
        'location.city': { $exists: true }
      }
    },
    {
      $group: {
        _id: {
          city: '$location.city',
          state: '$location.state'
        },
        listingCount: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        totalRooms: {
          $sum: {
            $cond: [
              { $isArray: '$floors' },
              { $size: '$floors' },
              0
            ]
          }
        }
      }
    },
    { $sort: { listingCount: -1 } },
    { $limit: 15 }
  ];

  try {
    const locations = await Listing.aggregate(pipeline);
    
    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    next(new ErrorResponse('Error fetching popular locations', 500));
  }
});

// ============================================
// Endpoint 6: Landlord Performance Metrics
// Topics: Complex $group, multiple conditions
// ============================================
/**
 * @desc    Get landlord metrics (ownership counts, avg pricing)
 * @route   GET /api/analytics/landlord-metrics
 * @access  Private/Admin
 * 
 * Demonstrates:
 * - $lookup stage (if needed for user population)
 * - Topic #28: Multiple accumulators per group
 * - Conditional aggregation with $cond
 */
exports.getLandlordMetrics = asyncHandler(async (req, res, next) => {
  const pipeline = [
    {
      $match: {
        owner: { $exists: true }
      }
    },
    {
      $group: {
        _id: '$owner',                       // Group by owner (landlord)
        listingCount: { $sum: 1 },           // Topic #28: $sum
        avgPrice: { $avg: '$price' },        // Topic #28: $avg
        totalListings: { $push: '$title' },  // Topic #28: $push
        
        // Count featured listings
        featuredCount: {
          $sum: { $cond: ['$featured', 1, 0] }
        },
        
        // Count active listings
        activeCount: {
          $sum: { $cond: ['$active', 1, 0] }
        }
      }
    },
    { $sort: { listingCount: -1 } },
    { $limit: 20 }
  ];

  try {
    const metrics = await Listing.aggregate(pipeline);
    
    // Populate owner details
    const enrichedMetrics = await Promise.all(
      metrics.map(async (metric) => {
        const owner = await User.findById(metric._id).select('name email');
        return {
          ...metric,
          owner: owner
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedMetrics.length,
      data: enrichedMetrics
    });
  } catch (error) {
    next(new ErrorResponse('Error fetching landlord metrics', 500));
  }
});
