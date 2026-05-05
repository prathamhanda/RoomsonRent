const asyncHandler = require('../middleware/async');
const Listing = require('../models/Listing');
const User = require('../models/User');
const Location = require('../models/Location');
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');

/**
 * ADMIN CONTROLLER - MongoDB Schema & Index Information
 * 
 * Topics Demonstrated:
 * -  MongoDB Data Hierarchy (Databases, Collections, Documents)
 * -  Data Types and Schema Design
 *  Index Management and Types
 * -  MongoDB Architecture (scaling, replication)
 * -  CAP Theorem (Consistency, Availability, Partition Tolerance)
 */


/**
 * @desc    Get detailed schema information for all collections
 * @route   GET /api/admin/schema-info
 * @access  Private/Admin
 * 
 * Demonstrates:
 * -  Database → Collection → Document → Fields hierarchy
 * -  Various data types (String, Number, ObjectId, Array, Object, Boolean, Date)
 * -  Schema validation rules
 * -  Referenced documents (relationships)
 */
exports.getSchemaInfo = asyncHandler(async (req, res, next) => {
  const schemas = {
    // ============================================
    // Collection 1: Users
    // ============================================
    users: {
      name: 'users',
      description: 'Stores user accounts (students, landlords, admins)',
      hierarchy: 'Database → Collections → users → Documents → Fields',
      fields: [
        {
          name: '_id',
          type: 'ObjectId',
          required: true,
          description: 'Topic #4: Primary key, auto-generated',
          unique: true,
          indexed: 'primary'
        },
        {
          name: 'name',
          type: 'String',
          required: true,
          description: 'User full name'
        },
        {
          name: 'email',
          type: 'String',
          required: true,
          unique: true,
          indexed: 'unique',
          description: 'Topic #17: Single field unique index'
        },
        {
          name: 'phone',
          type: 'String',
          required: true,
          unique: true,
          indexed: 'unique',
          description: 'Topic #17: Single field unique index'
        },
        {
          name: 'role',
          type: 'String',
          enum: ['user', 'landlord', 'admin'],
          default: 'user',
          indexed: 'compound',
          description: 'Topic #19: Used in compound index with verified'
        },
        {
          name: 'verified',
          type: 'Boolean',
          default: false,
          indexed: 'compound',
          description: 'Topic #19: Used in compound index with role'
        },
        {
          name: 'currentRooms',
          type: 'Array[Object]',
          description: 'Topic #3: Embedded documents (nested)',
          nested: [
            { name: 'listingId', type: 'ObjectId', ref: 'Listing' },
            { name: 'roomId', type: 'String' },
            { name: 'assignedBy', type: 'ObjectId', ref: 'User' },
            { name: 'active', type: 'Boolean' }
          ]
        }
      ]
    },

    // ============================================
    // Collection 2: Listings
    // ============================================
    listings: {
      name: 'listings',
      description: 'Stores property listings with hierarchical structure: Listings → Floors → Rooms → Tenants',
      hierarchy: 'Database → Collections → listings → Nested Documents (3 levels deep)',
      fields: [
        {
          name: '_id',
          type: 'ObjectId',
          required: true,
          description: 'Topic #4: Primary key'
        },
        {
          name: 'title',
          type: 'String',
          required: true,
          indexed: 'text',
          description: 'Topic #16: Part of text index for search'
        },
        {
          name: 'description',
          type: 'String',
          required: true,
          indexed: 'text',
          description: 'Topic #16: Part of text index for search'
        },
        {
          name: 'price',
          type: 'Number',
          description: 'Topic #8: Used with comparison operators ($gte, $lte)'
        },
        {
          name: 'location',
          type: 'Object (GeoJSON)',
          description: 'Topic #21: GeoJSON Point for geospatial queries',
          nested: [
            { name: 'type', type: 'String', value: 'Point' },
            { name: 'coordinates', type: 'Array[Number]', format: '[lng, lat]', indexed: '2dsphere' }
          ]
        },
        {
          name: 'floors',
          type: 'Array[Object]',
          description: 'Topic #3: Embedded array of floor documents (Level 1 nesting)',
          nested: [
            {
              name: 'floorId',
              type: 'String'
            },
            {
              name: 'rooms',
              type: 'Array[Object]',
              description: 'Topic #3: Embedded array of room documents (Level 2 nesting)',
              nested: [
                { name: 'roomId', type: 'String' },
                { name: 'price', type: 'Number' },
                { name: 'sharingOptions', type: 'Array[String]', enum: ['Single', 'Double', 'Triple', '4 Sharing'] },
                {
                  name: 'tenants',
                  type: 'Array[Object]',
                  description: 'Topic #3: Embedded array of tenant documents (Level 3 nesting)',
                  nested: [
                    { name: 'userId', type: 'ObjectId', ref: 'User' },
                    { name: 'name', type: 'String' },
                    { name: 'assignedAt', type: 'Date' }
                  ]
                }
              ]
            }
          ]
        },
        {
          name: 'amenities',
          type: 'Array[String]',
          indexed: 'text',
          description: 'Topic #12: Array of strings for amenities'
        },
        {
          name: 'owner',
          type: 'ObjectId',
          ref: 'User',
          indexed: 'compound',
          description: 'Topic #3: Foreign key reference to User. Topic #19: Part of compound index'
        },
        {
          name: 'active',
          type: 'Boolean',
          indexed: 'compound',
          description: 'Topic #19: Part of compound index (owner, active, createdAt). Topic #23: Partial index filter'
        }
      ]
    },

    // ============================================
    // Collection 3: Locations
    // ============================================
    locations: {
      name: 'locations',
      description: 'Reference data for cities/areas with geospatial coordinates',
      hierarchy: 'Database → Collections → locations → Documents',
      fields: [
        {
          name: '_id',
          type: 'ObjectId',
          required: true,
          description: 'Topic #4: Primary key'
        },
        {
          name: 'name',
          type: 'String',
          required: true,
          unique: true,
          description: 'Location name (e.g., Koramangala)'
        },
        {
          name: 'city',
          type: 'String',
          required: true,
          description: 'City name'
        },
        {
          name: 'geometry',
          type: 'Object (GeoJSON)',
          description: 'Topic #21: GeoJSON Point for geospatial queries',
          nested: [
            { name: 'type', type: 'String', value: 'Point' },
            { name: 'coordinates', type: 'Array[Number]', format: '[lng, lat]', indexed: '2dsphere' }
          ]
        },
        {
          name: 'popular',
          type: 'Boolean',
          default: false,
          description: 'Whether this is a popular location'
        }
      ]
    }
  };

  res.status(200).json({
    success: true,
    message: 'Topic #1: MongoDB Data Hierarchy and Schema Design',
    hierarchyExplanation: {
      level1: 'Database (roomsonrent)',
      level2: 'Collections (users, listings, locations)',
      level3: 'Documents (individual records with _id)',
      level4: 'Fields (properties with types and validation)',
      level5: 'Nested Documents (embedded arrays for complex structures)'
    },
    data: schemas
  });
});


/**
 * @desc    Get all indexes across collections
 * @route   GET /api/admin/indexes
 * @access  Private/Admin
 * 
 * Demonstrates:
 * -  Index concept and B-tree structure
 * -  Default _id index
 * -  Single field indexes
 * -  Compound indexes (multi-field)
 * -  Text indexes for search
 * -  Geospatial 2dsphere indexes
 * -  Partial indexes with filtering
 */
exports.getIndexInfo = asyncHandler(async (req, res, next) => {
  try {
    const indexes = {
      listings: [
        {
          name: '_id_',
          key: { _id: 1 },
          type: 'BTREE',
          topic: '#17',
          description: 'Topic #17: Default primary index. Automatically created on every collection.',
          usage: 'Fast document lookup by _id',
          performance: 'O(log n) - B-tree based'
        },
        {
          name: 'title_text_description_text_amenities_text',
          key: { title: 'text', description: 'text', amenities: 'text' },
          type: 'TEXT',
          topic: '#16',
          description: 'Topic #16: Text index for full-text search. Tokenizes and stems text.',
          usage: 'Enable $text operator: db.listings.find({ $text: { $search: "wifi" } })',
          performance: 'Fast text search across multiple fields',
          queryExample: 'find({ $text: { $search: "boys pg near iit" } })'
        },
        {
          name: 'owner_1_active_1_createdAt_-1',
          key: { owner: 1, active: 1, createdAt: -1 },
          type: 'COMPOUND',
          topic: '#19',
          description: 'Topic #19: Compound index for frequently used query pattern. Optimizes queries filtering by owner, active status, and sorted by date.',
          usage: 'Used by landlord dashboard to fetch their listings',
          queryExample: 'find({ owner: ObjectId(...), active: true }).sort({ createdAt: -1 })',
          performance: 'Very fast - all data in index'
        },
        {
          name: 'featured_1_active_1_createdAt_-1',
          key: { featured: 1, active: 1, createdAt: -1 },
          type: 'COMPOUND',
          topic: '#19',
          description: 'Topic #19: Compound index for featured listings query pattern.',
          usage: 'Homepage featured section',
          performance: 'Covered query - no collection scan needed'
        },
        {
          name: 'location.city_1_propertyType_1',
          key: { 'location.city': 1, propertyType: 1 },
          type: 'COMPOUND',
          topic: '#19',
          description: 'Topic #19: Compound index for city and property type filtering.',
          usage: 'Search filters by location and type',
          performance: 'Fast multi-field filtering'
        },
        {
          name: 'location.coordinates_2dsphere',
          key: { 'location.coordinates': '2dsphere' },
          type: 'GEOSPATIAL',
          topic: '#21, #22',
          description: 'Topic #21: Geospatial 2dsphere index. Topic #22: Enables $geoNear queries for location-based search.',
          usage: 'Find nearby listings: $geoNear with coordinates and maxDistance',
          queryExample: 'find({ location.coordinates: { $geoNear: { near: [lng, lat], maxDistance: 5000 } } })',
          performance: 'O(log n) for geospatial queries'
        },
        {
          name: 'createdAt_-1_partial_active_true',
          key: { createdAt: -1 },
          type: 'PARTIAL',
          topic: '#23',
          description: 'Topic #23: Partial index - only indexes active listings. Reduces index size and improves query performance for active subset.',
          filter: { active: true },
          usage: 'Queries filtering only active listings',
          benefit: 'Smaller index = faster inserts/updates and less memory'
        }
      ],
      users: [
        {
          name: '_id_',
          key: { _id: 1 },
          type: 'BTREE',
          topic: '#17',
          description: 'Topic #17: Default primary index'
        },
        {
          name: 'email_1_unique',
          key: { email: 1 },
          type: 'UNIQUE',
          unique: true,
          topic: '#18',
          description: 'Topic #18: Unique index ensures no duplicate emails',
          usage: 'Prevent duplicate user registrations'
        },
        {
          name: 'phone_1_unique',
          key: { phone: 1 },
          type: 'UNIQUE',
          unique: true,
          topic: '#18',
          description: 'Topic #18: Unique index ensures no duplicate phones',
          usage: 'Prevent duplicate phone numbers'
        },
        {
          name: 'role_1_verified_1',
          key: { role: 1, verified: 1 },
          type: 'COMPOUND',
          topic: '#19',
          description: 'Topic #19: Compound index for role-based queries',
          usage: 'Find all verified landlords: find({ role: "landlord", verified: true })',
          performance: 'Fast role-based filtering'
        },
        {
          name: 'email_1_partial_verified_true',
          key: { email: 1 },
          type: 'PARTIAL',
          topic: '#23',
          description: 'Topic #23: Partial index on verified emails only',
          filter: { verified: true },
          usage: 'Faster lookups for verified users'
        }
      ],
      locations: [
        {
          name: '_id_',
          key: { _id: 1 },
          type: 'BTREE',
          topic: '#17',
          description: 'Topic #17: Default primary index'
        },
        {
          name: 'geometry.coordinates_2dsphere',
          key: { 'geometry.coordinates': '2dsphere' },
          type: 'GEOSPATIAL',
          topic: '#21',
          description: 'Topic #21: 2dsphere index for location points',
          usage: 'Geospatial queries near cities'
        }
      ]
    };

    res.status(200).json({
      success: true,
      message: 'Topic #15-24: MongoDB Index Management and Types',
      explanation: {
        btree: 'Topic #15: B-tree indexes are default, support range and equality queries',
        compound: 'Topic #19: Multi-field indexes for common query patterns',
        text: 'Topic #16: Text indexes enable full-text search with $text operator',
        geospatial: 'Topic #21: 2dsphere indexes for geographic queries with $geoNear',
        partial: 'Topic #23: Filter expressions reduce index size for subset of documents',
        unique: 'Topic #18: Enforce unique values across documents'
      },
      data: indexes
    });
  } catch (error) {
    next(new ErrorResponse('Error fetching index information', 500));
  }
});

// ============================================
// Endpoint 3: Database Statistics
// Topics: #6 (Architecture), #26 (Scaling), CAP Theorem
// ============================================
/**
 * @desc    Get database statistics and scaling information
 * @route   GET /api/admin/db-statistics
 * @access  Private/Admin
 * 
 * Demonstrates:
 * - Topic #6: MongoDB Architecture and design
 * - Topic #26: Database Scaling (Replication, Sharding)
 * - Topic #6: CAP Theorem implications
 */
exports.getDBStatistics = asyncHandler(async (req, res, next) => {
  try {
    // Get collection stats
    const db = mongoose.connection.db;
    
    const userCount = await User.countDocuments();
    const listingCount = await Listing.countDocuments();
    const locationCount = await Location.countDocuments();

    const stats = {
      success: true,
      message: 'Topic #6: MongoDB Architecture and Topic #26-28: Database Scaling',
      
      collections: {
        users: {
          documentCount: userCount,
          description: 'User accounts (students, landlords, admins)',
          estimatedSizeInMB: (userCount * 0.001).toFixed(2)  // Rough estimate
        },
        listings: {
          documentCount: listingCount,
          description: 'Property listings with nested floors, rooms, and tenants',
          estimatedSizeInMB: (listingCount * 0.05).toFixed(2)  // Nested docs are larger
        },
        locations: {
          documentCount: locationCount,
          description: 'Reference data for cities with geospatial coordinates',
          estimatedSizeInMB: (locationCount * 0.0005).toFixed(2)
        }
      },

      totalDocuments: userCount + listingCount + locationCount,

      // Topic #6: CAP Theorem
      capTheorem: {
        topic: '#6',
        definition: 'MongoDB can provide any 2 of 3 guarantees in distributed system',
        consistency: {
          available: true,
          description: 'MongoDB ensures consistency by default. Write concern and read concern control this.'
        },
        availability: {
          available: true,
          description: 'Replica sets provide automatic failover for high availability'
        },
        partitionTolerance: {
          available: true,
          description: 'Sharding allows data distribution across partitions'
        },
        mongodbChoice: 'Consistency + Availability (CA) - when replica set is primary. With sharding, still provides CA within partitions.'
      },

      // Topic #26-28: Scaling Strategies
      scalingStrategies: {
        vertical: {
          name: 'Vertical Scaling (Scale-Up)',
          topic: '#26',
          description: 'Add more CPU, RAM, storage to single server',
          pros: 'Simple, no code changes',
          cons: 'Hardware limits, single point of failure'
        },
        horizontal: {
          name: 'Horizontal Scaling (Scale-Out)',
          topic: '#26',
          description: 'Distribute data across multiple servers',
          methods: {
            replication: {
              topic: '#26',
              description: 'Replica Sets - Multiple copies of data for HA and read scaling',
              implementation: 'In MongoDB Atlas: 3-node replica set provides failover',
              benefit: 'Automatic failover, read scaling, data redundancy'
            },
            sharding: {
              topic: '#26',
              description: 'Distribute data by shard key for write scaling',
              howItWorks: 'Data divided into chunks across multiple shards',
              components: 'Shards (data), Config Servers (metadata), Mongos (router)',
              benefit: 'Write scaling, data distribution, query routing'
            }
          }
        }
      },

      currentArchitecture: {
        description: 'Single instance or MongoDB Atlas cluster',
        replication: 'Enabled via MongoDB Atlas (3-node replica set)',
        sharding: 'Can be enabled by choosing shard key (e.g., listing owner)',
        recommendedShardKey: {
          field: 'owner',
          reason: 'Distributes listings across landlords, prevents hotspots'
        }
      },

      indexStrategy: {
        totalIndexes: 14,
        description: 'Carefully chosen indexes balance query performance with write overhead',
        strategy: 'Compound indexes for common queries, partial indexes for subsets, text index for search'
      },

      performanceNotes: {
        note1: 'Text search ($text) is efficient with text index',
        note2: '2dsphere index enables fast geospatial queries',
        note3: 'Compound indexes support covered queries (results from index alone)',
        note4: 'Partial indexes reduce memory footprint and insert/update times'
      }
    };

    res.status(200).json(stats);
  } catch (error) {
    next(new ErrorResponse('Error fetching database statistics', 500));
  }
});

// ============================================
// Endpoint 4: Query Performance Information
// Topics: #24 (Covered Queries), Index Usage
// ============================================
/**
 * @desc    Get information about covered queries and query optimization
 * @route   GET /api/admin/query-performance
 * @access  Private/Admin
 * 
 * Demonstrates:
 * - Topic #24: Covered Queries - query satisfied entirely by index
 * - Query optimization techniques
 * - Which indexes support which queries
 */
exports.getQueryPerformance = asyncHandler(async (req, res, next) => {
  const performance = {
    success: true,
    message: 'Topic #24: Covered Queries and Query Optimization',

    coveredQueries: {
      definition: 'Query that is satisfied entirely by an index, without needing to fetch documents from collection',
      benefit: 'Very fast - no collection scan required, all data in memory from index',
      requirement: 'All fields in query and projection must be in index',
      
      examples: [
        {
          query: 'find({ owner: ObjectId(...), active: true }, { _id: 0, owner: 1, active: 1, createdAt: 1 })',
          index: 'owner_1_active_1_createdAt_-1',
          isCovered: true,
          reason: 'All query and projection fields are in the compound index',
          performance: 'O(log n) - index scan only'
        },
        {
          query: 'find({ featured: true, active: true }, { featured: 1, active: 1, createdAt: 1 })',
          index: 'featured_1_active_1_createdAt_-1',
          isCovered: true,
          reason: 'All fields in index, no collection lookup needed',
          performance: 'Extremely fast'
        },
        {
          query: 'find({ owner: ObjectId(...), active: true }, { title: 1, price: 1 })',
          index: 'owner_1_active_1_createdAt_-1',
          isCovered: false,
          reason: 'Title and price not in index - must fetch from collection',
          performance: 'O(n) - collection scan required'
        }
      ]
    },

    indexSelection: {
      'Topic #18: Single Field Indexes': 'Best for: queries on one field, low cardinality',
      'Topic #19: Compound Indexes': 'Best for: multiple field queries, ESR rule (Equality, Sort, Range)',
      'Topic #16: Text Indexes': 'Best for: full-text search, keyword matching',
      'Topic #21: Geospatial Indexes': 'Best for: location-based queries with $geoNear, $near',
      'Topic #23: Partial Indexes': 'Best for: subset of documents, reduces overhead'
    },

    optimizationTips: [
      'Use compound indexes for queries with multiple filter conditions',
      'Place equality fields first in compound index',
      'Place sort field in middle of compound index (ESR rule)',
      'Place range fields last in compound index',
      'Use partial indexes for large collections with subset queries',
      'Monitor query performance with explain() to identify missing indexes',
      'Avoid over-indexing - each index has write penalty'
    ]
  };

  res.status(200).json(performance);
});
