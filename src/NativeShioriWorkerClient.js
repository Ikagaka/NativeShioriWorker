class NativeShioriWorkerClient {

  static path() {
    return typeof require !== 'undefined' ? require('path') : BrowserFS.BFSRequire('path');
  }

  static buffer() {
    return typeof require !== 'undefined' ? require('buffer') : BrowserFS.BFSRequire('buffer');
  }

  // @return [string] mount point for node.js FS
  get mount_point() { return '/mnt'; }

  // @abstract
  // @return [WorkerClient] SHIORI worker client
  get worker() { throw new Error('worker() not implemented'); }

  // @param [node.js/BrowserFS Filesystem] fs the filesystem
  constructor(fs = null) {
    this.fs = fs;
  }

  // SHIORI 2.x/3.x load() and transfer files to worker on pre-load
  // @param [String] dirpath the 'ghost/master' path string that ends with path separator ('/' or '\')
  // @return [Promise<number>] load() response code
  load(dirpath) {
    if (!this.fs) {
      const realdirpath = NativeShioriWorkerClient.path().join(this.mount_point, dirpath.replace(/^[^\/\\]*[\/\\]/, '/')).replace(/\\/g, '/');
      const root = dirpath.replace(/^([^\/\\]*[\/\\]).*$/, '$1');
      return this._mount('NodeFS', this.mount_point, root).then(() => this._load(realdirpath));
    } else {
      const result = dirpath.match(/^(.+)ghost[\\\/]([^\/]+)[\\\/]ghost[\\\/]master[\\\/]$/);
      const fs_root = result[1];
      this.dirpath = dirpath;
      this.ghostpath = result[2];
      this.storage = new NanikaStorage(new NanikaStorage.Backend.FS(fs_root, this.fs, NativeShioriWorkerClient.path(), NativeShioriWorkerClient.buffer().Buffer));
      return this._push(dirpath).then(() => this._load(dirpath));
    }
  }

  // @nodoc
  _mount(type, mount_point, root) {
    return this.worker.request('mount', [type, mount_point, root]);
  }

  // @nodoc
  _push(dirpath) {
    return this.storage.ghost_master(this.ghostpath)
      .then((directory) =>
        directory.asArrayBuffer()
      ).then((directory) => {
        const transferable = [];
        Object.keys(directory).forEach((path) => {
          const data = directory[path];
          transferable.push(data);
        });
        return this.worker.request('push', [dirpath, directory], transferable);
      });
  }

  // @nodoc
  _load(dirpath) {
    return this.worker.request('load', dirpath);
  }

  // SHIORI 2.x/3.x request()
  // @param [String] request SHIORI 2.x/3.x Request string
  // @return [Promise<string>] request() response string
  request(request) {
    return this.worker.request('request', request);
  }

  // SHIORI 2.x/3.x unload() and save files from worker on post-unload
  // @return [Promise<number>] unload() response code
  unload() {
    if (!this.fs) {
      return this._unload()
        .then((code) =>
          this._umount(this.mount_point)
            .then(() =>
              this.worker.terminate()
            ).then(() =>
              code
            )
        );
    } else {
      return this._unload()
        .then((code) =>
          this._pull(this.dirpath)
            .then(() =>
              this.worker.terminate()
            ).then(() =>
              code
            )
        );
    }
  }

  // @nodoc
  _unload() {
    return this.worker.request('unload');
  }

  // @nodoc
  _umount(mount_point) {
    return this.worker.request('umount', mount_point);
  }

  // @nodoc
  _pull(dirpath) {
    return this.worker.request('pull', dirpath)
    .then((directory) =>
      this.storage.ghost_master(this.ghostpath, new NanikaDirectory(directory))
    );
  }

}

if (typeof module !== 'undefined') module.exports = NativeShioriWorkerClient;
if (typeof window !== 'undefined') window.NativeShioriWorkerClient = NativeShioriWorkerClient;
