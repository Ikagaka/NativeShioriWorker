(function() {
  const SingleFileWorker = require('single-file-worker');
  const NativeShioriWorkerClient = require('native-shiori-worker');
  const WorkerClient = require('worker-client-server/WorkerClient');

  function workerRoutine() {
    WORKER_ROUTINE
  }

  function clientRoutine(workerMaker) {
    class SHIORI_CLASSWorker extends NativeShioriWorkerClient {
      get worker() { return this._worker; }

      constructor(fs, workerErrorHandler) {
        super(); // no fs with fork
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

  SingleFileWorker.fork(workerRoutine, clientRoutine, SingleFileWorker.scriptFilenameFromError(new Error()));
})();
