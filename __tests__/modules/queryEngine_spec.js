describe("The Query Engine", function() {
  var queryEngine = require.requireActual('../../source/js/modules/queryEngine'),
      fixtures = require.requireActual('../testQueries'),
      testId = "nodeidtest",
      testQuery = fixtures.testQuery,
      testDb = fixtures.NodeDB;

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

  it("queries the database for the root NodeIDs in query", function() {
    queryEngine(testQuery, function(obj) {
      expect(obj[testId].test).toEqual("nodeidtest.test");
    });
  });

  it("maps node queries onto a set of connections", function() {
    console.log(testQuery);
    queryEngine(testQuery, function(obj) {
      console.log(JSON.stringify(obj).split(',').join('\n'));
      expect(obj[testId].friends.length).toEqual(1);
      expect(obj[testId].friends[0].test).toEqual("friend1.test");
    });
  });
});
