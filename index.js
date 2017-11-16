#!/usr/bin/env node
var program = require('commander');
var http = require('http');
var fs = require('fs');

const whiteBG = '\x1b[47m'; // White Background
const redFG = '\x1b[31m'; // Red Foreground
const reset = '\x1b[0m'; // Reset Styling

/*
 * Downloads a file from the URL specified.
 */
var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
		if(cb) console.log(redFG + whiteBG, err.message, reset);
  });
};

program
 .arguments('<url>')
 .arguments('<dest>')
 .action(function(url, dest) {
   download(url, dest, function() {
		 console.log("\x1b[32m", "File downloaded from " + url + ".", "\x1b[0m");
	 });
 })
 .parse(process.argv);