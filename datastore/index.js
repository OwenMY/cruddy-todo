const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
Promise.promisifyAll(fs);

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

  //Promise.all(files)
  //.then( () => {
  //   'something'
  // })
  //.catch( () => {
  //   'something else'
  // })

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('Failed to fetch files');
    } else {
      console.log(files, 'this is line 54');

      // fs.readFile(exports.dataDir + '/' + idVar, (err, text) => {
      //   if (err) {
      //     callback(new Error(`No item with id: ${id}`));
      //   } else {
      //     let realText = '' + text;
      //     callback(null, {id: id, text: realText});
      //     // return {id: id, text: realText};
      //   }
      // });

      //map files and apply the fs.read to every element



      //we need to get the text from every file.
      //how do we get the text from every file.

      //I - files, an array strings
      //O - an array of objects
      //C - none
      //E - empty array...
      //p1 = reading all the files

      // Promise.all([p1, p2])
      //   .then(())
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
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

  // fs.readdir (exports.dataDir, (err, files) => {
  // err
  // iterate files (current file includes id)
  // let idVar = current file
  // fs.readfile(exports.data + 'idVar', (err, text) =>
  // err
  // callback (null, text))
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('party');
    } else {
      let idVar;
      for (let file of files) {
        if (file.includes(id)) {
          idVar = file;
          break;
        }
      }
      if (!idVar) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        fs.readFile(exports.dataDir + '/' + idVar, (err, text) => {
          if (err) {
            callback(new Error(`No item with id: ${id}`));
          } else {
            let realText = '' + text;
            callback(null, {id: id, text: realText});
            // return {id: id, text: realText};
          }
        });
      }
    }
  });
};



exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  //fs.readdir(exports.dataDir, (err, files) =>
  //if (err)
  // throw err;
  //else
  // iterate files
  // idVar = file
  // if file is not found
  // throw error
  // otherwise
  // fs.writeFile(exports.dataDir + '/' + idVar, inputText, (err) =>
  // if (err)
  // throw error
  // otherwise
  // callback(null, {id: id, text: inputText})

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('Panda ate files');
    } else {
      let idVar;
      for (let file of files) {
        if (file.includes(id)) {
          idVar = file;
        }
      }
      if (!idVar) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        fs.writeFile(exports.dataDir + '/' + idVar, text, (err) => {
          if (err) {
            throw ('Panda blocks you');
          } else {
            callback(null, {id: id, text: text});
            // return {id: id, text: text};
          }
        });
      }
    }
  });

};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  //psuedocode

  //fs.readdir(exports.dataDir, (err, files) => {
  //if err
  //throw err
  //otherwise
  //create idVar
  //iterate files
  //if file is equal to input id
  //make idVar equal current file
  //break here
  //if idVar is undefined
  //throw a party
  //otherwise
  //fs.rm(exports.dataDir + '/' + idVar, (err) =>
  //if err
  //throw err
  //otheriwse
  //invoke callback

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('throw panda');
    } else {
      let idVar;
      for (let file of files) {
        if (file.includes(id)) {
          idVar = file;
          break;
        }
      }
      if (!idVar) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        fs.rm(exports.dataDir + '/' + idVar, (err) => {
          if (err) {
            callback(new Error(`No item with id: ${id}`));
          } else {
            callback(null);
          }
        });
      }
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

// exports.id = index;

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
