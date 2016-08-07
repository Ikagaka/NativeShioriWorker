'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NativeShioriWorkerClient = function () {
  _createClass(NativeShioriWorkerClient, [{
    key: 'mount_point',


    // @return [string] mount point for node.js FS
    get: function get() {
      return '/mnt';
    }

    // @abstract
    // @return [WorkerClient] SHIORI worker client

  }, {
    key: 'worker',
    get: function get() {
      throw new Error('worker() not implemented');
    }

    // @param [node.js/BrowserFS Filesystem] fs the filesystem

  }], [{
    key: 'path',
    value: function path() {
      return typeof require !== 'undefined' ? require('path') : BrowserFS.BFSRequire('path');
    }
  }, {
    key: 'buffer',
    value: function buffer() {
      return typeof require !== 'undefined' ? require('buffer') : BrowserFS.BFSRequire('buffer');
    }
  }]);

  function NativeShioriWorkerClient() {
    var fs = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, NativeShioriWorkerClient);

    this.fs = fs;
  }

  // SHIORI 2.x/3.x load() and transfer files to worker on pre-load
  // @param [String] dirpath the 'ghost/master' path string that ends with path separator ('/' or '\')
  // @return [Promise<number>] load() response code


  _createClass(NativeShioriWorkerClient, [{
    key: 'load',
    value: function load(dirpath) {
      var _this = this;

      if (!this.fs) {
        var _ret = function () {
          var realdirpath = NativeShioriWorkerClient.path().join(_this.mount_point, dirpath.replace(/^[^\/\\]*[\/\\]/, '/')).replace(/\\/g, '/');
          var root = dirpath.replace(/^([^\/\\]*[\/\\]).*$/, '$1');
          return {
            v: _this._mount('NodeFS', _this.mount_point, root).then(function () {
              return _this._load(realdirpath);
            })
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      } else {
        var result = dirpath.match(/^(.+)ghost[\\\/]([^\/]+)[\\\/]ghost[\\\/]master[\\\/]$/);
        var fs_root = result[1];
        this.dirpath = dirpath;
        this.ghostpath = result[2];
        this.storage = new NanikaStorage(new NanikaStorage.Backend.FS(fs_root, this.fs, NativeShioriWorkerClient.path(), NativeShioriWorkerClient.buffer().Buffer));
        return this._push(dirpath).then(function () {
          return _this._load(dirpath);
        });
      }
    }

    // @nodoc

  }, {
    key: '_mount',
    value: function _mount(type, mount_point, root) {
      return this.worker.request('mount', [type, mount_point, root]);
    }

    // @nodoc

  }, {
    key: '_push',
    value: function _push(dirpath) {
      var _this2 = this;

      return this.storage.ghost_master(this.ghostpath).then(function (directory) {
        return directory.asArrayBuffer();
      }).then(function (directory) {
        var transferable = [];
        Object.keys(directory).forEach(function (path) {
          var data = directory[path];
          transferable.push(data);
        });
        return _this2.worker.request('push', [dirpath, directory], transferable);
      });
    }

    // @nodoc

  }, {
    key: '_load',
    value: function _load(dirpath) {
      return this.worker.request('load', dirpath);
    }

    // SHIORI 2.x/3.x request()
    // @param [String] request SHIORI 2.x/3.x Request string
    // @return [Promise<string>] request() response string

  }, {
    key: 'request',
    value: function request(_request) {
      return this.worker.request('request', _request);
    }

    // SHIORI 2.x/3.x unload() and save files from worker on post-unload
    // @return [Promise<number>] unload() response code

  }, {
    key: 'unload',
    value: function unload() {
      var _this3 = this;

      if (!this.fs) {
        return this._unload().then(function (code) {
          return _this3._umount(_this3.mount_point).then(function () {
            return _this3.worker.terminate();
          }).then(function () {
            return code;
          });
        });
      } else {
        return this._unload().then(function (code) {
          return _this3._pull(_this3.dirpath).then(function () {
            return _this3.worker.terminate();
          }).then(function () {
            return code;
          });
        });
      }
    }

    // @nodoc

  }, {
    key: '_unload',
    value: function _unload() {
      return this.worker.request('unload');
    }

    // @nodoc

  }, {
    key: '_umount',
    value: function _umount(mount_point) {
      return this.worker.request('umount', mount_point);
    }

    // @nodoc

  }, {
    key: '_pull',
    value: function _pull(dirpath) {
      var _this4 = this;

      return this.worker.request('pull', dirpath).then(function (directory) {
        return _this4.storage.ghost_master(_this4.ghostpath, new NanikaDirectory(directory));
      });
    }
  }]);

  return NativeShioriWorkerClient;
}();

if (typeof module !== 'undefined') module.exports = NativeShioriWorkerClient;
if (typeof window !== 'undefined') window.NativeShioriWorkerClient = NativeShioriWorkerClient;
