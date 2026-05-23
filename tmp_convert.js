const fs = require('fs');
const lines = fs.readFileSync('example/components/example.vue', 'utf8').split('\n');
const start = 51;
const end = 98;
let html = lines.slice(start, end + 1).join('\n');
html = html.replace(/^\s*htmlContent:\s*`/, '');
html = html.replace(/`,?\s*$/, '');
const escaped = html
  .replace(/\\/g, '\\\\')
  .replace(/'/g, "\\'")
  .replace(/\n/g, '\\n');
console.log("'" + escaped + "'");
