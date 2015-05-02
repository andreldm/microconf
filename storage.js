// Stripped down fork of https://github.com/amativos/node-storage

var fs = require('fs');
var async = require('async');
var mkdirp = require('mkdirp');

function Storage(filename) {
    if (!filename) throw new Error('Storage requires path to a storage file');

    var self = this;

    self.filename = filename;
    self.tempFilename = filename + '~';
    self.backupFilename = filename + '~~';

    self.queue = async.queue(function (task, cb) {
        self._persist(function (err) {
            if (err) throw err;
            cb();
        });
    });

    self.store = self._load();
    self._resolvePath();
}

Storage.prototype.get = function (key) {
    if (typeof key !== 'string') throw new Error('key must be a string');

    return this.store[key];
};

Storage.prototype.put = function (key, value) {
    if (typeof key !== 'string') throw new Error('key must be a string');

    this.store[key] = value;
    this.queue.push();
};

Storage.prototype.remove = function (key) {
    if (typeof key !== 'string')  throw new Error('key must be a string');

    delete this.store[key];
    this.queue.push();
};

Storage.prototype.all = function() {
    return this.store;
}

Storage.prototype._fileMustNotExist = function (file, cb) {
    fs.exists(file, function (exists) {
        if (!exists) return cb(null);

        fs.unlink(file, function (err) {
            return cb(err);
        });
    });
};

Storage.prototype._persist = function (cb) {
    var self = this;
    var _data = JSON.stringify(self.store);

    async.series([
        async.apply(self._fileMustNotExist, self.tempFilename),
        async.apply(self._fileMustNotExist, self.backupFilename),
        async.apply(self._doBackup.bind(self)),
        async.apply(self.writeData, self.tempFilename, _data),
        async.apply(fs.rename, self.tempFilename, self.filename),
        async.apply(self._fileMustNotExist, self.backupFilename)
    ], cb);
};

Storage.prototype.writeData = function (filename, data, cb) {
    var _fd;

    async.waterfall([
        async.apply(fs.open, filename, 'w'),

        function (fd, cb) {
            _fd = fd;
            var buf = new Buffer(data);
            var offset = 0;
            var position = 0;

            fs.write(fd, buf, offset, buf.length, position, cb);
        },

        function (written, buf, cb) {
            fs.fsync(_fd, cb);
        },

        function (cb) {
            fs.close(_fd, cb);
        }
    ], function (err) {
        cb(err);
    });
};

Storage.prototype._doBackup = function (cb) {
    var self = this;

    fs.exists(self.filename, function (exists) {
        if (!exists) return cb(null);

        fs.rename(self.filename, self.backupFilename, cb);
    });
};

Storage.prototype._load = function () {
    try {
        return JSON.parse(fs.readFileSync(this.filename));
    } catch(e) {
        if (e.code !== 'ENOENT') throw e;
        return {};
    }
};

Storage.prototype._resolvePath = function () {
    var _path = this.filename.split('/').slice(0, -1).join('/');
    if (_path) mkdirp.sync(_path);
};

module.exports = Storage;
