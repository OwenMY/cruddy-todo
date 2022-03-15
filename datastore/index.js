const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  /*
  If we tried to get the id out here by assigning it to a variable, the variable would be
  undefined because getNextUniqueID is asynchronous.  We have to get it when it becomes available.
  */
  counter.getNextUniqueId((err, id) => {
    //That id is avaiable at the end of getNextUniqueId.
    items[id] = text;
    //we do not need to worry about err, as that will be accounted for in counter.js
    //err will recieve null if the getNextUniqueId is successfull.
    fs.writeFile(exports.dataDir + `/${id}.txt`, text, (err) => {
      if (err) {
        throw ('Failed to write todo list item to file');
      } else {
        //in test.js, two tests wanted us to send in an object with two properties, id and text.
        callback(null, {id: id, text: text});
      }
    });
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });

  //I - callback function
  //O - array of todos
  //C - no sync or promises (yet)
  //E - none

  //Psuedocode

  //fs.readDir (exports.dataDir, do an err first function
  //if we get an error
  //throw an error
  //otherwise
  //console.log(files)
  //use callback

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('Failed to fetch files');
    } else {
      // console.log(files);
      // {files.id: id, files.text: id}
      //create a new array using map
      //the helper function will take each element (todo) and return each
      //element as an object with Ryans format.

      //insert this new array into the callback
      let listItems = files.map((element) => {
        let dotIndex = element.indexOf('.');
        let fileNum = element.slice(0, dotIndex);
        return {id: fileNum, text: fileNum};
      });
      callback(null, listItems);
      // return files;
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

// exports.id = index;

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
