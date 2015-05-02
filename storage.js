var Storage = require('node-storage');
var storage = new Storage('store.db');

exports.get = function(key) {
  return storage.get(key);
}

exports.put = function(key, value) {
  storage.put(key, value);
}

exports.all = function() {
  return storage.store;
}

exports.delete = function(key) {
  storage.remove(key);
}

module.exports = exports;
