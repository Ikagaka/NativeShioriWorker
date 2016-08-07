const fs = require('fs');
const path = require('path');
const cp = require('cp');
const makefork = require('../../makefork');

const worker_dir = path.dirname(__filename);

const kawari_fork = makefork.makeWorkerScript('Kawari', 'kawari', 'kawari.js');
fs.writeFileSync(path.join(worker_dir, 'kawari-fork.js'), kawari_fork);
const node_modules_dir = path.join(worker_dir ,'node_modules');

if (!fs.existsSync(node_modules_dir)) fs.mkdirSync(node_modules_dir);
cp.sync(require.resolve('../../NativeShioriWorkerClient.js'), path.join(node_modules_dir, 'native-shiori-worker.js'));
