# GraphNoQL
Facebook's GraphQL backend implemented with Node+Mongo

# Brief

`./source/js/modules/queryEngine.js` is the primary module in this project, which
takes in a query object (defined in `./docs/schema.md`)", and a callback. It then
 makes a bunch of mongo queries and returns the requested tree to a callback.

# Example

We have tweaked Facebook's GraphQL format to be JSON compatible. The biggest
change is that we got rid of calls, and use string id's for root node queries,
and special **Edge** objects for querying edges.

Let's look at an example query:

```js
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
```js
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
```js
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
```js
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
```js
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

