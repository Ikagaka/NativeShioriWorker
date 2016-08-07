const shiori = new SHIORI_CLASS();
const shiorihandler = new NativeShioriEncode(new NativeShiori(shiori));
const worker_server = new WorkerServer({
  push: ([dirpath, directory]) =>
    new Promise((resolve, reject) =>
      resolve({contents: shiorihandler.push(dirpath, directory)})
    ),
  mount: ([type, mount_point, root]) =>
    new Promise((resolve, reject) =>
      resolve({contents: shiorihandler.mount(type, mount_point, root)})
    ),
  load: (dirpath) =>
    new Promise((resolve, reject) =>
      resolve({contents: shiorihandler.load(dirpath)})
    ),
  request: (request) =>
    new Promise((resolve, reject) =>
      resolve({contents: shiorihandler.request(request)})
    ),
  unload: () =>
    new Promise((resolve, reject) =>
      resolve({contents: shiorihandler.unload()})
    ),
  umount: (mount_point) =>
    new Promise((resolve, reject) =>
      resolve({contents: shiorihandler.umount(mount_point)})
    ),
  pull: (dirpath) =>
    new Promise((resolve, reject) => {
      const directory = shiorihandler.pull(dirpath);
      const transferable = [];
      Object.keys(directory).forEach((path) => {
        const data = directory[path];
        transferable.push(data);
      });
      resolve({contents: directory, transferable: transferable});
    }),
});
