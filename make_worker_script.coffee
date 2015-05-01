fs = require 'fs'
client = fs.readFileSync process.argv[2], encoding: 'utf8'
server = fs.readFileSync process.argv[3], encoding: 'utf8'
shiori = fs.readFileSync process.argv[4], encoding: 'utf8'
dep1 = fs.readFileSync process.argv[5], encoding: 'utf8'
dep2 = fs.readFileSync process.argv[6], encoding: 'utf8'
dep3 = fs.readFileSync process.argv[7], encoding: 'utf8'
dep4 = fs.readFileSync process.argv[8], encoding: 'utf8'

worker_code = shiori + dep1 + dep2 + dep3 + dep4 + server
code = 'var worker_code = "' +
	worker_code
	.replace(/\\/g, "\\\\")
	.replace(/"/g, "\\\"")
	.replace(/\r/g, "\\r")
	.replace(/\n/g, "\\n") +
	'";' + client
console.log code
