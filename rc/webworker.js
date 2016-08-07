(function() {
  const workerCode = "WORKER_CODE";

  function clientRoutine(workerMaker) {
    class SHIORI_CLASSWorker extends NativeShioriWorkerClient {
      get worker() { return this._worker; }

      constructor(fs, workerErrorHandler) {
        super(fs);
        this._worker = new WorkerClient(workerMaker(), workerErrorHandler);
      }
    }

    if (typeof window !== 'undefined') {
      window.SHIORI_CLASSWorker = SHIORI_CLASSWorker;
      if (window.ShioriLoader) {
        window.ShioriLoader.shiories.SHIORI_LOADER_ID = SHIORI_CLASSWorker;
      } else {
        throw new Error("load ShioriLoader first");
      }
    } else { // node.js
      module.exports = SHIORI_CLASSWorker;
      if (typeof require !== 'undefined') {
        const ShioriLoader = require('shioriloader');
        ShioriLoader.shiories.SHIORI_LOADER_ID = SHIORI_CLASSWorker;
      }
    }
  }

  SingleFileWorker.webworker(workerCode, clientRoutine);
})();
