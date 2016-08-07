const fs = require('fs');
const path = require('path');
const makewebworker = require('../../makewebworker');

const worker_dir = path.dirname(__filename);

const shiori_code = fs.readFileSync(require.resolve('kawari.js'), {encoding: 'utf8'});
const kawari_webworker = makewebworker.makeWorkerScript('Kawari', 'kawari', shiori_code);
fs.writeFileSync(path.join(worker_dir, 'kawari-webworker.js'), kawari_webworker);
