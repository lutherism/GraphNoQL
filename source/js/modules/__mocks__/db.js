var testDb = require.requireActual('../../../../__tests__/testQueries').NodeDB;

module.exports = {
  get: function(query, callback) {
    callback(testDb[query.id]);
  }
}
