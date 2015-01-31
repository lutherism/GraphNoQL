var queryEngine,
  mongoose = require('mongoose');

//take in schema query obejcts, spit out mongo queries

queryEngine = function queryEngine(query, opts) {
  mongoQuery = query;


  return mongoQuery;
}

modules.epxorts = queryEngine;
