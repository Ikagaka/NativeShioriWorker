class NativeShioriWorkerServer {
  constructor(shiori) {
    this.shiorihandler = new NativeShiori(shiori);
    this.worker_server = new WorkerServer({
      push: async ([dirpath, directory]) =>
        await {contents: this.shiorihandler.push(dirpath, directory)},
      load: async (dirpath) =>
        await {contents: this.shiorihandler.load(dirpath)},
      request: async (request) =>
        await {contents: this.shiorihandler.request(request)},
      unload: async () =>
        await {contents: this.shiorihandler.unload()},
      pull: async (dirpath) => {
          const directory = this.shiorihandler.pull(dirpath);
          const transferable = [];
          for (let path in Object.keys(directory)) {
            const data = directory[path];
            transferable.push(data);
          }
          return await {contents: directory, transferable: transferable};
      },
    });
  }
}
