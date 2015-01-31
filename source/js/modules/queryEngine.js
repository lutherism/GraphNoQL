var queryEngine,
  db = require('db');

function isEdge(value) { //duck type edge objects
  return !!(
    value &&
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === 'object' &&
    typeof value[1] === 'object'
  );
}

function map(obj, fn) {
  var newObj = {};
  for(var i in obj) {
    newObj[i] = fn(obj[i], i, obj);
  }
  return newObj;
}

function filter(obj, filter) {
  var ret = {};
  map(filter, function(a, v, k) {
    if (v === true) a[k] = obj[k];
  });
  return ret;
}

function reduce(obj, fn, a) {
  map(obj, function(v, k) {
    a = fn(a, v, k);
  });
}

function hasAll(obj, compare) {
  var ret = true;
  for (var i in compare) {
    ret = ret && Object.prototype.hasOwnProperty.call(obj, i);
  }
  return ret;
}


/*
* Fetches the given NodeID, and recursively fetches any subsequent edges in node
* Once done building tree, calls callback with tree as arg
*/
function queryNode(id, node, callback) {
  var edges = {},
    attributes = {};
  map(node, function(v, k) {
    if (isEdge(v)) {
      edges[k] = v
    } else {
      attributes[k] = v;
    }
  });

  db.get(id, function(model) {
    var ret = filter(model, attributes);

    map(edges, function(v, k) {

      queryEdge(model[k], v, function(connections) {
        ret[k] = connections;

        if (hasAll(ret, edges)) {
          callback(ret);
        }
      });
    }
  });
}

function queryEdge(edge, query, callback) {
  var options = query[0],
    node = query[1],
    connections = [];

  edge.map(function(connection, i) {
    queryNode(connection.node.id, node, function(model) {
      connections[i] = model;
      if (hasAll(connections, edge)) {
        callback(connections);
      }
    });
  });
};
//take in schema query obejcts, spit out mongo queries

queryEngine = function queryEngine(queries, callback) {
  var results = {};
  queries.map(function(node, id) {
    queryNode(id, node, function(result) {
      results[id] = result;
      if (hasAll(queries, results)) {
        callback(results);
      }
    })
  });
}

modules.exports = queryEngine;
