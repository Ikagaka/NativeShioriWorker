class NativeShioriWorkerServer
  constructor: (shiori) ->
    @shiorihandler = new NativeShiori(shiori)
    @worker_server = new WorkerServer
      push: ([dirpath, directory]) =>
        new Promise (resolve, reject) =>
          resolve contents: @shiorihandler.push(dirpath, directory)
      load: (dirpath) =>
        new Promise (resolve, reject) =>
          resolve contents: @shiorihandler.load(dirpath)
      request: (request) =>
        new Promise (resolve, reject) =>
          resolve contents: @shiorihandler.request(request)
      unload: =>
        new Promise (resolve, reject) =>
          resolve contents: @shiorihandler.unload()
      pull: (dirpath) =>
        new Promise (resolve, reject) =>
          directory = @shiorihandler.pull(dirpath)
          transferable = []
          for path, data of directory
            transferable.push data
          resolve contents: directory, transferable: transferable

@NativeShioriWorkerServer = NativeShioriWorkerServer
