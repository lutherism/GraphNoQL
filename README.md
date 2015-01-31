# GraphNoQL
Facebook's GraphQL backend implemented with Node+Mongo

**read the docs.**

**write tests.**

**take over the world.**

# Brief

`/source/js/modules/queryEngine.js` is the primary module in this project, which
takes in a query object (defined in `docs/schema.md`), and a callback. It then
 makes a bunch of mongo queries and returns the queried tree to a callback.
