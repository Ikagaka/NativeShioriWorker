class NativeShioriWorkerServer {
  constructor(shiori) {
    this.shiorihandler = new NativeShiori(shiori);
    this.worker_server = new WorkerServer({
      push: ([dirpath, directory]) =>
        new Promise((resolve, reject) =>
          resolve({contents: this.shiorihandler.push(dirpath, directory)})
        ),
      load: (dirpath) =>
        new Promise((resolve, reject) =>
          resolve({contents: this.shiorihandler.load(dirpath)})
        ),
      request: (request) =>
        new Promise((resolve, reject) =>
          resolve({contents: this.shiorihandler.request(request)})
        ),
      unload: =>
        new Promise((resolve, reject) =>
          resolve({contents: this.shiorihandler.unload()})
        ),
      pull: (dirpath) =>
        new Promise((resolve, reject) => {
          const directory = this.shiorihandler.pull(dirpath);
          const transferable = [];
          for (let path in Object.keys(directory)) {
            const data = directory[path];
            transferable.push(data);
          }
          return resolve({contents: directory, transferable: transferable});
        }),
    });
  }
}

this.NativeShioriWorkerServer = NativeShioriWorkerServer;
