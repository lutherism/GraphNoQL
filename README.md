# GraphNoQL
Facebook's GraphQL backend implemented with Node+Mongo

**read the docs.**

**write tests.**

**contribute.**

**take over the world.**

# Brief

`./source/js/modules/queryEngine.js` is the primary module in this project", which
takes in a query object (defined in `./docs/schema.md`)", and a callback. It then
 makes a bunch of mongo queries and returns the queried tree to a callback.

# Example

We have tweaked Facebook's GraphQL format to be JSON compatible. The biggest
changes is that we use string id's for root calls, and special **Edge**
objects for queriying edges.

Let's look at an example query:

```sh
{
  nodeidtest: {       // Give a Node ID for us to start from
    id: true,         // Define which fields we want to return
    test: true,
    name: true,
    friends: {        // A special <Edge> object for the friends set
      get: {          // rules for how to traverse edge
        all: true,
      },              // A model of the data to return
      node: {
        id: true,
        test: true,
        name: true
      }
    }
  }
}
```
This query would start at the root node with `id === 'nodeidtest'`, getting the
`id`, `test`, and `name` fields. Then it would traverse the `friends` edge,
finding related nodes according the rules set by the `edge.get` hash. For each
found node, it would return the fields defined in `edge.node` if this node
include edges, it will continue making queries until it has found everything
requested.

And example response might look like:
```sh
{
  nodeidtest: {
    id: "nodeidtest",
    test: "nodeidtest.test",
    name: "nodeidtest.name",
    friends: [
      {
        id: "friend1",
        test: "friend1.test",
        name: "friend1.name"
      }, {
        id: "friend2",
        test: "friend2.test",
        name: "friend2.name"
      }
    ]
  }
}
```

Here's the Mongo documents which would generate that response form that query:

####NodeIdTest
```sh
{
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
}
```
####Friend1
```sh
{
  id: "friend1",
  test: "friend1.test",
  name: "friend1.name",
  friends: [
    {
      cursor: 1,
      node: {
        id: "nodeidtest"
      }
    }
  ]
}
```
####Friend2
```sh
{
  id: "friend2",
  test: "friend2.test",
  name: "friend2.name",
  friends: [
    {
      cursor: 1,
      node: {
        id: "nodeidtest"
      }
    }
  ]
},
```

