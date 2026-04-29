const express = require('express');
const {
  getSchemaInfo,
  getIndexInfo,
  getDBStatistics,
  getQueryPerformance
} = require('../controllers/admin');

const router = express.Router();
const { checkAuthMiddleWare, authorize } = require('../middleware/auth');

/**
 * ADMIN ROUTES - Educational endpoints showing MongoDB concepts
 * 
 * Topics Demonstrated:
 * - #1: MongoDB Data Hierarchy
 * - #15-24: Index Management and Types
 * - #6: MongoDB Architecture
 * - #26-28: Database Scaling and CAP Theorem
 */

// Topic #1: Schema information - MongoDB hierarchy, data types, relationships
router.get('/schema-info', getSchemaInfo);

// Topic #15-24: Index information - all index types and strategies
router.get('/indexes', getIndexInfo);

// Topic #6, #26-28: Database statistics - scaling, replication, sharding, CAP theorem
router.get('/db-statistics', getDBStatistics);

// Topic #24: Query performance and covered queries
router.get('/query-performance', getQueryPerformance);

module.exports = router;
