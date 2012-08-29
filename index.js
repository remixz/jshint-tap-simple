/*jslint node: true, es5: true, loopfunc: true */
"use strict";
var JSHINT = require('jshint').JSHINT,
    fs = require('fs'),
    glob = require('glob'),
    colors = require('colors');

var TEST_COUNT = 0;
var FAIL_COUNT = 0;
process.on('exit', function () {
    process.stdout.write("1.." + TEST_COUNT + "\n");
    process.stdout.write("# fail " + FAIL_COUNT + "\n");
});

function runFile(fname, opt) {
    var src = fs.readFileSync(fname, 'utf-8');
    var ok = JSHINT(src, opt);

    process.stdout.write(ok ? "ok " : "not ok ");
    process.stdout.write(++TEST_COUNT + " - " + fname);
    process.stdout.write("\n");

    var errors = JSHINT.data().errors;
    if (errors) {
        FAIL_COUNT++;
        process.stderr.write("# Failed test " + fname.yellow + "\n#\n#");
        for (var i=0,l=errors.length; i<l; i++) {
            var line = errors[i];
            var buf  = '  ' + line.id.red + ' ';
                buf += line.raw.replace(/\{(.)\}/, function (m) { return line[m[1]]; }).red;
                buf += ' at line ' + line.line + "\n#\n#";
                buf += line.evidence + "\n#";
            for (var j=0; j<line.character-1; j++) {
                buf += ' ';
            }
                buf += "^\n#\n#\n";
            if (i!==l-1) {
                buf += "#";
            }
            process.stderr.write(buf);
        }
    }
}

function run() {
    var patterns = [];
    var opt = {};
    for (var i=0, l=arguments.length; i<l; i++) {
        if (typeof arguments[i] === 'object') {
            opt = arguments[i];
        } else {
            patterns.push(arguments[i]);
        }
    }
    patterns.forEach(function (pattern) {
        glob(pattern, function (err, files) {
            if (err) { throw err; }
            files.forEach(function (fname) {
                runFile(fname, opt);
            });
        });
    });
}

module.exports.run = run;
module.exports.runFile = runFile;

