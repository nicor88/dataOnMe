var xlsx = require('node-xlsx');
var sheets = xlsx.parse('./utilities/data/consumo_auto.xlsx');
// parses a file

console.log(sheets);