var fs = require('fs');
var path = require('path');
var read = require('read');


// fs.readdir('/tmp/', function(err, items) {
//     console.log(items);
 
//     for (var i=0; i<items.length; i++) {
//         console.log(items[i]);
//     }
// });
// fs.readdir('/home/nowuser/src/src/elm/', function(err, items) {
//     console.log(items);
 
//     for (var i=0; i<items.length; i++) {
//         console.log(items[i]);
//     }
// });
var dir = '/tmp'
var walkSync = function(dir, filelist) {
    var path = path || require('path');
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        }
        else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
};
console.log(walkSync('/tmp'));