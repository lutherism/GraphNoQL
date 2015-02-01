var queryEngine,
  db = require('./db');

function isEdge(value) { //duck type edge objects
  if (value &&
    typeof value === 'object') {
    var length = 0;
    for (var i in value) {
      length+=1;
    }
    return !!(
      length === 2 &&
      typeof value.get === 'object' &&
      typeof value.node === 'object'
    );
  } else {
    return false;
  }

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
  map(filter, function(v, k) {
    if (v === true) ret[k] = obj[k];
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
    attributes = {},
    hasEdges = false;
  map(node, function(v, k) {
    if (isEdge(v)) {
      edges[k] = v;
      hasEdges = true;
    } else {
      attributes[k] = v;
    }
  });

  db.get({id: id}, function(model) {
    var ret = filter(model, attributes);
    if (hasEdges) {
      map(edges, function(v, k) {

        traverseEdges(model[k], v, function(connections) {
          ret[k] = connections;

          if (hasAll(ret, edges)) {
            callback(ret);
          }
        });
      });
    } else {
      callback(ret);
    }
  });
}

function traverseEdges(edge, query, callback) {
  var options = query.get,
    node = query.node,
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
  map(queries, function(node, id) {
    queryNode(id, node, function(result) {
      results[id] = result;
      if (hasAll(queries, results)) {
        callback(results);
      }
    })
  });
};

queryEngine.isEdge = isEdge;

module.exports = queryEngine;
