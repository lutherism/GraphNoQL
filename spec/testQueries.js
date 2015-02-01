var fixtures = {
  testQuery: {
    nodeidtest: {
      id: true,
      test: true,
      name: true,
      friends: {
        get: {
          all: true,
        },
        node: {
          id: true,
          test: true,
          name: true
        }
      }
    }
  },
  NodeDB: {
    nodeidtest: {
      id: "nodeidtest",
      test: "nodeidtest.test",
      name: "nodeidtest.name",
      friends: [
        {
          cursor: 1,
          node: {
            id: "friend1"
          }
        },
        {
          cursor: 2,
          node: {
            id: "friend2"
          }
        }
      ]
    },
    friend1: {
      id: "friend1",
      test: "friend1.test",
      name: "friend1.name",
      friends: [
        {
          cursor: 1,
          node: {
            id: "nodeidtest"
          }
        },
        {
          cursor: 2,
          node: {
            id: "friend2"
          }
        }
      ]
    },
    friend2: {
      id: "friend2",
      test: "friend2.test",
      name: "friend2.name",
      friends: [
        {
          cursor: 1,
          node: {
            id: "nodeidtest"
          }
        },
        {
          cursor: 2,
          node: {
            id: "friend1"
          }
        }
      ]
    },
  }
};



modules.exports = fixtures;
