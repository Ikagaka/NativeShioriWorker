#!/usr/bin/env node --harmony
const fs = require('fs');
const makeWorker = require('../makewebworker.js');

const argc = process.argv.length;
const bundle_all = process.argv[argc - 4];
const shiori_class_name = process.argv[argc - 3];
const shiori_loader_id = process.argv[argc - 2];
const shiori_file = process.argv[argc - 1];
if (!((argc === 5 || argc === 6) && shiori_class_name && shiori_loader_id && shiori_file)) {
  console.log('Usage:');
  console.log('  makewebworker ShioriClassName shiori_loader_id shiori_file.js > shiori-webworker.js');
  console.log('  makewebworker all ShioriClassName shiori_loader_id shiori_file.js > shiori-webworker.js');
  process.exit(1);
}

const shiori_code = fs.readFileSync(shiori_file, {encoding: 'utf8'});
console.log(makeWorker.makeWorkerScript(shiori_class_name, shiori_loader_id, shiori_code, bundle_all === 'all'));
