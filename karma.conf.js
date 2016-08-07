var path = require('path');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['detectBrowsers', 'mocha'],
    plugins: [
      'karma-mocha',
      'karma-mocha-own-reporter',
      'karma-ie-launcher',
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-electron',
      'karma-safari-launcher',
      'karma-opera-launcher',
      'karma-detect-browsers',
      'karma-espower-preprocessor',
      'karma-babel-preprocessor',
    ],
    files: [
      require.resolve('power-assert/build/power-assert'),
      // require.resolve('bluebird/js/browser/bluebird'),
      require.resolve('shioriloader/lib/ShioriLoader'),
      // require.resolve('worker-client-server/WorkerClient'),
      // require.resolve('single-file-worker'),
      require.resolve('browserfs/dist/browserfs'),
      // require.resolve('narloader'),
      // require.resolve('nanika-storage'),
      // require.resolve('nanika-storage/NanikaStorage.backend.FS'),
      // './NativeShioriWorkerClient.js',
      'test/webworker.js',
      'test/workers/kawari-webworker.js',
      'test/fork.js',
    ],
    exclude: ['**/*.swp'],
    preprocessors: {
      'src/**/*.js': ['babel', 'espower'],
      'test/**/*.js': ['babel', 'espower'],
    },
    reporters: ['mocha-own'],
    detectBrowsers: {
      postDetection: function(availableBrowsers) {
        const result = availableBrowsers;
        if (process.env.TRAVIS) {
          const chrome_index = availableBrowsers.indexOf('Chrome');
          if (chrome_index >= 0) {
            result.splice(chrome_index, 1);
            result.push('Chrome_travis_ci');
          }
        }
        const phantom_index = availableBrowsers.indexOf('PhantomJS');
        if (phantom_index >= 0) result.splice(phantom_index, 1);
        result.push('Electron');
        return result;
      },
    },
    espowerPreprocessor: {
      transformPath: function(path) { return path.replace(/\.js/, '.espowered.js'); },
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline',
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      },
    },
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [],
    singleRun: false,
    concurrency: Infinity,
  });
};
