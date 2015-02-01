var rewire = require('rewire');

describe("The Query Engine", function() {
  var queryEngine = rewire('../../source/js/modules/queryEngine'),
      fixtures = require('helpers/modules/testQueries'),
      testId = "nodeidtest",
      testQuery = fixtures.testQuery,
      testDb = fixtures.NodeDB;

  queryEngine.__set__("db", {
    get: function(query, callback) {
      callback(testDb[query.id]);
    }
  });

  it("recognizes an edge", function() {
    var positive = {
        get: {
          first: 10
        },
        node: {
          id: true,
          friends: true
        }
      },
      negative = {
        num_friends: true,
        last_added: true
      };
    expect(queryEngine.isEdge(positive)).toEqual(true);
    expect(queryEngine.isEdge(negative)).toEqual(false);
  });

  it("queries the database for root NodeIDs in query", function() {
    queryEngine.queryEngine(testQuery, function(obj) {
      expect(obj.test).toEqual("nodeidtest.test");
    });
  });

  it("maps node queries onto a set of connections", function() {
    queryEngine.queryEngine(testQuery, function(obj) {
      console.log(obj);
      expect(obj.friends.length).toEqual(2);
      expect(obj.friends[1].test).toEqual("friends2.test");
    });
  });
});
