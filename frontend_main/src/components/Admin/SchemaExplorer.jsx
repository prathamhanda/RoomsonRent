import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../shared/Footer';

const SchemaExplorer = () => {
  const [schemaInfo, setSchemaInfo] = useState(null);
  const [indexInfo, setIndexInfo] = useState(null);
  const [dbStats, setDbStats] = useState(null);
  const [queryPerf, setQueryPerf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('schema');
  const [selectedCollection, setSelectedCollection] = useState('users');

  useEffect(() => {
    fetchSchemaInfo();
  }, []);

  const fetchSchemaInfo = async () => {
    setLoading(true);
    try {
      const [schema, indexes, stats, perf] = await Promise.all([
        axios.get('/api/admin/schema-info'),
        axios.get('/api/admin/indexes'),
        axios.get('/api/admin/db-statistics'),
        axios.get('/api/admin/query-performance')
      ]);

      setSchemaInfo(schema.data);
      setIndexInfo(indexes.data);
      setDbStats(stats.data);
      setQueryPerf(perf.data);
    } catch (error) {
      console.error('Error fetching schema info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading database schema...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Database Schema Explorer</h1>
          <p className="text-gray-300">Explore your database structure, indexes, and optimization strategies</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
            {['schema', 'indexes', 'statistics', 'performance'].map(view => (
              <motion.button
                key={view}
                onClick={() => setActiveView(view)}
                whileHover={{ y: -2 }}
                className={`px-6 py-3 font-semibold capitalize whitespace-nowrap transition-all ${
                  activeView === view
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view}
              </motion.button>
            ))}
          </div>

          {/* Schema View */}
          {activeView === 'schema' && schemaInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Collections Structure</h2>
              
              {/* Collection Selector */}
              <div className="flex gap-3 mb-8">
                {['users', 'listings', 'locations'].map(collection => (
                  <motion.button
                    key={collection}
                    onClick={() => setSelectedCollection(collection)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 rounded-lg font-semibold capitalize transition ${
                      selectedCollection === collection
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {collection}
                  </motion.button>
                ))}
              </div>

              {/* Collection Details */}
              {schemaInfo.data?.[selectedCollection] && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-md p-8"
                >
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {schemaInfo.data[selectedCollection].name}
                    </h3>
                    <p className="text-gray-600 text-lg mb-4">
                      {schemaInfo.data[selectedCollection].description}
                    </p>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-blue-900">Hierarchy:</span>{' '}
                        <span className="text-gray-600">{schemaInfo.data[selectedCollection].hierarchy}</span>
                      </p>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-6">Fields</h4>
                  <div className="space-y-4">
                    {schemaInfo.data[selectedCollection].fields?.map((field, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="text-lg font-bold text-gray-900">{field.name}</h5>
                            <p className="text-sm text-blue-600 font-mono mt-1">{field.type}</p>
                          </div>
                          <div className="flex gap-2">
                            {field.required && (
                              <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-semibold">
                                Required
                              </span>
                            )}
                            {field.unique && (
                              <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-semibold">
                                Unique
                              </span>
                            )}
                            {field.indexed && (
                              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                                {field.indexed}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-3">{field.description}</p>

                        {field.nested && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-600 mb-3">Nested Fields:</p>
                            <div className="bg-gray-50 rounded-lg p-3">
                              {field.nested.map((nestedField, nIdx) => (
                                <div key={nIdx} className="text-sm text-gray-700 py-1">
                                  <span className="font-mono text-blue-600">{nestedField.name}</span>
                                  <span className="text-gray-500 mx-2">—</span>
                                  <span>{nestedField.type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Indexes View */}
          {activeView === 'indexes' && indexInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Index Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 20 }} className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <p className="text-gray-700 font-semibold">B-Tree Indexes</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">Default</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 20 }} transition={{ delay: 0.1 }} className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <p className="text-gray-700 font-semibold">Text Indexes</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">Full-Text</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 20 }} transition={{ delay: 0.2 }} className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                  <p className="text-gray-700 font-semibold">Geospatial</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">2dsphere</p>
                </motion.div>
              </div>

              <div className="space-y-8">
                {Object.entries(indexInfo.data || {}).map(([collection, indexes]) => (
                  <motion.div 
                    key={collection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-md p-8"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6 capitalize">{collection} Collection Indexes</h3>
                    <div className="space-y-4">
                      {indexes.map((index, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900">{index.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Type: <span className="font-mono text-blue-600">{index.type}</span>
                              </p>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                              index.type === 'BTREE' ? 'bg-blue-100 text-blue-700' :
                              index.type === 'TEXT' ? 'bg-green-100 text-green-700' :
                              index.type === 'GEOSPATIAL' ? 'bg-purple-100 text-purple-700' :
                              index.type === 'COMPOUND' ? 'bg-orange-100 text-orange-700' :
                              index.type === 'UNIQUE' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {index.type}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{index.description}</p>
                          <p className="text-xs text-gray-600"><span className="font-semibold">Usage:</span> {index.usage}</p>
                          <p className="text-xs text-gray-600 mt-1"><span className="font-semibold">Performance:</span> {index.performance}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Statistics View */}
          {activeView === 'statistics' && dbStats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Database Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-2xl shadow-md">
                  <p className="text-gray-600 text-sm font-semibold mb-2">Total Documents</p>
                  <p className="text-4xl font-bold text-blue-600">{dbStats.totalDocuments}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-md">
                  <p className="text-gray-600 text-sm font-semibold mb-2">Collections</p>
                  <p className="text-4xl font-bold text-green-600">{Object.keys(dbStats.collections || {}).length}</p>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md p-8 mb-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Collections Overview</h3>
                <div className="space-y-4">
                  {Object.entries(dbStats.collections || {}).map(([name, data]) => (
                    <div key={name} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-gray-900 capitalize">{name}</h4>
                          <p className="text-sm text-gray-600">{data.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{data.documentCount}</p>
                          <p className="text-xs text-gray-600">{data.estimatedSizeInMB} MB</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {dbStats.capTheorem && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-md p-8"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">CAP Theorem</h3>
                  <p className="text-gray-700 mb-6">{dbStats.capTheorem.definition}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {['consistency', 'availability', 'partitionTolerance'].map(prop => (
                      <div key={prop} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-gray-900 capitalize mb-2">{prop.replace(/Tolerance/, ' Tolerance')}</h4>
                        <p className="text-sm text-gray-700">{dbStats.capTheorem[prop].description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Performance View */}
          {activeView === 'performance' && queryPerf && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Query Performance</h2>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md p-8 mb-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Covered Queries</h3>
                <p className="text-gray-700 mb-4">{queryPerf.coveredQueries.definition}</p>
                <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg mb-6 border border-green-200">
                  <span className="font-semibold">Benefit:</span> {queryPerf.coveredQueries.benefit}
                </p>

                <h4 className="font-bold text-gray-900 mb-4">Examples</h4>
                <div className="space-y-4">
                  {queryPerf.coveredQueries.examples?.map((example, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:border-blue-300 transition"
                    >
                      <p className="font-mono text-sm text-blue-600 mb-3 break-all bg-white p-2 rounded">{example.query}</p>
                      <div className="flex gap-2 mb-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          example.isCovered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {example.isCovered ? '✓ Covered' : '✗ Not Covered'}
                        </span>
                        <span className="text-xs text-gray-600 bg-white px-3 py-1 rounded">{example.performance}</span>
                      </div>
                      <p className="text-xs text-gray-700">{example.reason}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md p-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Optimization Tips</h3>
                <ul className="space-y-3">
                  {queryPerf.optimizationTips?.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold text-lg mt-1">•</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="container mx-auto px-4 pb-8">
        <motion.button
          onClick={fetchSchemaInfo}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-md"
        >
          Refresh Schema Info
        </motion.button>
      </div>

      <Footer />
    </div>
  );
};

export default SchemaExplorer;
