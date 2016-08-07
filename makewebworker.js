const fs = require('fs');
const babel = require('babel-core');
const UglifyJS = require('uglify-js');

function babelResult(code) {
  return babel.transform(code, {presets: ['es2015']}).code;
}

function uglifyResult(code) {
  return UglifyJS.minify(code, {fromString: true}).code;
}

function makeWorkerScript(shiori_class_name, shiori_loader_id, shiori_code, bundle_all) {
  let bundle = "";
  if (bundle_all) {
    bundle = [
      require.resolve('bluebird/js/browser/bluebird'),
      require.resolve('worker-client-server/WorkerClient'),
      require.resolve('single-file-worker'),
      require.resolve('narloader'),
      require.resolve('nanika-storage'),
      require.resolve('nanika-storage/NanikaStorage.backend.FS'),
      require.resolve('./NativeShioriWorkerClient.js'),
    ].map((file) => fs.readFileSync(file, {encoding: 'utf8'})).join("");
  }
  const worker_code_str = catServerCode(shiori_class_name, shiori_code)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "\\\"")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n");
  return uglifyResult(bundle + babelResult(
    fs.readFileSync(require.resolve('./rc/webworker.js'), {encoding: 'utf8'})
      .replace(/SHIORI_CLASS/g, shiori_class_name)
      .replace(/SHIORI_LOADER_ID/g, shiori_loader_id)
      .replace(/WORKER_CODE/g, worker_code_str)
  ));
}

function catServerCode(shiori_class_name, shiori_code) {
  const bluebird_code = fs.readFileSync(require.resolve('bluebird/js/browser/bluebird'), {encoding: 'utf8'});
  const worker_server_code = fs.readFileSync(require.resolve('worker-client-server/WorkerServer'), {encoding: 'utf8'});
  const single_file_worker = fs.readFileSync(require.resolve('single-file-worker'), {encoding: 'utf8'});
  const encoding_japanese_code = fs.readFileSync(require.resolve('encoding-japanese'), {encoding: 'utf8'});
  const native_shiori_code = fs.readFileSync(require.resolve('nativeshiori'), {encoding: 'utf8'});
  const native_shiori_encode_code = fs.readFileSync(require.resolve('nativeshiori/nativeshiori-encode'), {encoding: 'utf8'});
  const server_code = babelResult(
    fs.readFileSync(require.resolve('./rc/server.js'), {encoding: 'utf8'})
      .replace(/SHIORI_CLASS/g, shiori_class_name)
  );
  return uglifyResult(
    shiori_code
      + bluebird_code
      + worker_server_code
      + single_file_worker
      + encoding_japanese_code
      + native_shiori_code
      + native_shiori_encode_code
      + server_code
  );
}

module.exports = {catServerCode, makeWorkerScript};
