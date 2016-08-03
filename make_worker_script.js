const fs = require('fs');
const client = fs.readFileSync(process.argv[2], {encoding: 'utf8'});
const server = fs.readFileSync(process.argv[3], {encoding: 'utf8'});
const shiori = fs.readFileSync(process.argv[4], {encoding: 'utf8'});
const dep1 = fs.readFileSync(process.argv[5], {encoding: 'utf8'});
const dep2 = fs.readFileSync(process.argv[6], {encoding: 'utf8'});
const dep3 = fs.readFileSync(process.argv[7], {encoding: 'utf8'});
const dep4 = fs.readFileSync(process.argv[8], {encoding: 'utf8'});
const dep5 = fs.readFileSync(process.argv[9], {encoding: 'utf8'});

const worker_code = shiori + dep1 + dep2 + dep3 + dep4 + dep5 + server;
const code = 'var worker_code = "' +
	worker_code
	.replace(/\\/g, "\\\\")
	.replace(/"/g, "\\\"")
	.replace(/\r/g, "\\r")
	.replace(/\n/g, "\\n") +
	'";' + client;
console.log(code);
