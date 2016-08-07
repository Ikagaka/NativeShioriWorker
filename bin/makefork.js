#!/usr/bin/env node --harmony
const fs = require('fs');
const makeWorker = require('../makefork.js');

const argc = process.argv.length;
const shiori_class_name = process.argv[argc - 3];
const shiori_loader_id = process.argv[argc - 2];
const shiori_module = process.argv[argc - 1];
if (!(argc === 5 && shiori_class_name && shiori_loader_id && shiori_module)) {
  console.log('Usage:\n  makefork ShioriClassName shiori_loader_id shiori_module > shiori-fork.js');
  process.exit(1);
}

console.log(makeWorker.makeWorkerScript(shiori_class_name, shiori_loader_id, shiori_module));
