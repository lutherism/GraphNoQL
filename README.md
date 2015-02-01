# GraphNoQL
Facebook's GraphQL backend implemented with Node+Mongo

**read the docs.**

**write tests.**

**contribute.**

**take over the world.**

# Brief

`./source/js/modules/queryEngine.js` is the primary module in this project, which
takes in a query object (defined in `./docs/schema.md`), and a callback. It then
 makes a bunch of mongo queries and returns the queried tree to a callback.

# Example

We have tweaked Facebook's GraphQL format to be JSON compatible. The biggest
changes is that we use string id's for root calls, and special **Edge**
objects for queriying edges.

Let's look at an example:

```sh
{
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
}
```
This query would start at the root node with `id === 'nodeidtest'`, getting the
`id`, `test`, and `name` fields. Then it would traverse the `friends` edge,
finding related nodes according the rules set by the `edge.get` hash.

And example response might look like:
```sh
{
  "nodeidtest": {
    "id":"nodeidtest",
    "test":"nodeidtest.test",
    "name":"nodeidtest.name",
    "friends":[
      {
        "id":"friend1"
        "test":"friend1.test"
        "name":"friend1.name"
      }, {
        "id":"friend2",
        "test":"friend2.test",
        "name":"friend2.name"
      }
    ]
  }
}
```
