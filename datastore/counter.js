const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

//This is an error first callback?
//fs.readFile = takes in a file path to read from, and calls your callback once it has finished.

//If all goes well, the file contents are returned in the data argument.

//But if somethings goes wrong (the file doesn’t exist, permission is denied, etc) the first err argument will be populated with an error object containing information about the problem.

const readCounter = (callback = (err, id) => id + 1) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

//I think this is a CPS
//counter string will be saved to the file using counterfile
//
const writeCounter = (count, callback) => {
  counter = count;
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  readCounter((err, id) => writeCounter(id + 1, callback));
};


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');

//CounterFile
//path.join() I think when this is invoked, saves the information

//__dir name is the directory where counter.txt is saved