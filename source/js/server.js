var server = require('http'),
  url = require('url'),
  mongoose = require('mongoose'),
  queryEngine = require('modules/queryEngine');

mongoose.connect('mongodb://localhost:27017');
console.log('connecting to DB...');
mongoose.connection.on('open', function() {
  console.log('connected to DB');
  var NodeSchema = mongoose.schema(nodeschema),
    Node = mongoose.Model(NodeSchema);
  http.createServer(function(req, resp) {
    if (req.method === 'GET') {
      queryEngine(
        JSON.parse(url.parse(req.url, true).query.q),
        function(err, tree) {
          resp.writeHead(200, {
            'Content-Type': 'application/json',
            'Allow-Access-Origin': '*'
          });
          resp.write(JSON.stringify(tree));
        }
      );
    } else if (req.method === 'POST') {
      req.read(function(data) {
        Node.update(data.id, data, function (err, models) {
          if (err) {
            resp.writeHead(500);
            resp.write(err);
          } else {
            resp.writeHead(200, {
              'Content-Type': 'application/json',
              'Allow-Access-Origin': '*'
            });
            resp.write(JSON.stringify(models[0]));
          }
          resp.close();
        });
      });
    }
  }).listen(8008);
