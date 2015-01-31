#GraphNoQL Schema

Goal: Simply and poweruflly query a directed graph structure in MongoDB.
Surface that database via a Relay-able API.

### Nodes JSON
```sh
{
    _id: NodeID,
    attributes: mixed,
    edge_type: Array<Connection>
}
```

Nodes hold most of the data that we use in our app. Any piece of data could be
represented as a node, from a User to a Video to a Server event.


### Connection JSON
```sh
{
    cursor: CursorID,
    node: {
        id: NodeID,
        attributes: mixed
    }
}
```


Connections are small objects that point at a node. They can carry any amount of
 data, but only require an id:NodeID field. The CursorID is used to identify a
 connection within a list.

### Query JSON
```sh
{
    NodeID: {
        attributes: true,
        edge: [{ //query options
                options: true
            }, { //object model
                cursor: true,
                node: {
                    attributes: true
                }
            }]
        }
    }
}
```

#####NodeID
A uniq node identifier
