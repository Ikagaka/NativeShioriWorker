var _path;
var _buffer;
var NanikaStorage;
var BrowserFS;
if (typeof require !== 'undefined') {
  _path = require('path');
  _buffer = require('buffer');
} else {
  NanikaStorage = this.NanikaStorage;
  BrowserFS = this.BrowserFS;
  const _window = {};
  BrowserFS.install(_window);
  _path = _window.require('path');
  _buffer = _window.require('buffer');
}

class NativeShioriWorkerClient {

  // @abstract
  // @return [WorkerClient] SHIORI worker client
  worker() { throw new Error('worker() not implemented'); }

  // @param [node.js/BrowserFS Filesystem] fs the filesystem
  // @param [boolean] is_node_fs if false then FS push/pull will be performed
  constructor(fs, is_node_fs = typeof require !== 'undefined') {
    this.fs = fs;
    this.is_node_fs = is_node_fs;
  }

  // SHIORI 2.x/3.x load() and transfer files to worker on pre-load
  // @param [String] dirpath the 'ghost/master' path string that ends with path separator ('/' or '\')
  // @return [Promise<number>] load() response code
  load(dirpath) {
    if (this.is_node_fs) {
      return this._load(dirpath);
    } else {
      const result = dirpath.match(/^(.+)ghost[\\\/]([^\/]+)[\\\/]ghost[\\\/]master[\\\/]$/);
      const fs_root = result[1];
      this.dirpath = dirpath;
      this.ghostpath = result[2];
      this.storage = new NanikaStorage(new NanikaStorage.Backend.FS(fs_root, this.fs, _path, _buffer.Buffer));
      return this._push(dirpath).then(() => this._load(dirpath));
    }
  }

  // @nodoc
  _push(dirpath) {
    return this.storage.ghost_master(this.ghostpath)
      .then((directory) =>
        directory.asArrayBuffer()
      ).then((directory) => {
        const transferable = [];
        for (let path in Object.keys(directory)) {
          const data = directory[path];
          transferable.push(data);
        }
        return this.worker().request('push', [dirpath, directory], transferable);
      });
  }

  // @nodoc
  _load(dirpath) {
    return this.worker().request('load', dirpath);
  }

  // SHIORI 2.x/3.x request()
  // @param [String] request SHIORI 2.x/3.x Request string
  // @return [Promise<string>] request() response string
  request(request) {
    return this.worker().request('request', request);
  }

  // SHIORI 2.x/3.x unload() and save files from worker on post-unload
  // @return [Promise<number>] unload() response code
  unload() {
    if (this.is_node_fs) {
      return this._unload()
        .then((code) =>
          this.worker().terminate()
          .then(() =>
            code
          )
        );
    } else {
      return this._unload()
        .then((code) =>
          this._pull(this.dirpath)
            .then(() =>
              this.worker().terminate()
            ).then(() =>
              code
            )
        );
    }
  }

  // @nodoc
  _unload() {
    return this.worker().request('unload');
  }

  // @nodoc
  _pull(dirpath) {
    return this.worker().request('pull', dirpath)
    .then((directory) =>
      this.storage.ghost_master(this.ghostpath, new NanikaDirectory(directory))
    );
  }

}

this.NativeShioriWorkerClient = NativeShioriWorkerClient
