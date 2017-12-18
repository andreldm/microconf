var
http         = require('http'),

// express and its middlewares
bodyParser   = require('body-parser'),
express      = require('express'),
favicon      = require('serve-favicon'),
morgan       = require('morgan'),

Storage      = require('./storage')
;

var storage = new Storage('store.db');
var app = express();

// setup environment
app.set('port', process.env.PORT || 3000);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

// define routes
app.get('/api', function(req, res) {
  var keys = storage.all();
  var all = [];
  for (key in keys) all.push({key: key, value: keys[key]});
  res.json(all);
});

app.get('/api/:key', function(req, res) {
  var key = req.params.key;
  res.json(storage.get(key));
});

app.put('/api/:key', function(req, res) {
  var key = req.params.key;
  var value = req.param('value');
  storage.put(key, value);
  res.json({"key": key, "value": value});
});

app.delete('/api/:key', function(req, res) {
  var key = req.params.key;
  storage.remove(key);
  res.json({"key": key});
});

// start server
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
