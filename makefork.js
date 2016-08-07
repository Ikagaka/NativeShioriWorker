const fs = require('fs');
const babel = require('babel-core');
const UglifyJS = require('uglify-js');

function babelResult(code) {
  return babel.transform(code, {presets: ['es2015']}).code;
}

function uglifyResult(code) {
  return UglifyJS.minify(code, {fromString: true}).code;
}

function makeWorkerScript(shiori_class_name, shiori_loader_id, shiori_module) {
  const worker_routine = catServerRoutine(shiori_class_name, shiori_module);
  return babelResult(
    fs.readFileSync(require.resolve('./rc/fork.js'), {encoding: 'utf8'})
      .replace(/SHIORI_CLASS/g, shiori_class_name)
      .replace(/SHIORI_LOADER_ID/g, shiori_loader_id)
      .replace(/WORKER_ROUTINE/g, worker_routine)
  );
}

function catServerRoutine(shiori_class_name, shiori_module) {
  const requires = [
    [shiori_class_name, shiori_module],
    ['NativeShiori', 'nativeshiori'],
    ['NativeShioriEncode', 'nativeshiori/nativeshiori-encode'],
    ['WorkerServer', 'worker-client-server/WorkerServer'],
    ['SingleFileWorker', 'single-file-worker'],
    ['Promise', 'bluebird'],
  ].map((module) => `const ${module[0]} = require('${module[1]}');\n`).join("");
  const server_code = babelResult(
    fs.readFileSync(require.resolve('./rc/server.js'), {encoding: 'utf8'})
      .replace(/SHIORI_CLASS/g, shiori_class_name)
  );
  return uglifyResult(requires + server_code);
}

module.exports = {catServerRoutine, makeWorkerScript};
