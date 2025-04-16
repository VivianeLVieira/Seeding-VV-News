const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => { //this style of export defines a dictionary with the function as attribute 
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};


/*
how to import it: 
const { convertTimestampToDate } = require("./utils")

utils func:
function convertTimestampToDate({ created_at, ...otherProperties }) { 
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};
module.exports = convertTimestampToDate; // if the export was like this,  convertTimestampToDate should be a function
// return this format -->  [Function: convertTimestampToDate]
*/

/*
how to import it: 
const utilsModule  = require("./utils")
console.log(utilsModule)
console.log(utilsModule.convertTimestampToDate)

utils func:
function convertTimestampToDate({ created_at, ...otherProperties }) { 
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};
exports.convertTimestampToDate = convertTimestampToDate;
exports.myFunc2 = convertTimestampToDate;
exports.NAME = "Anything";
returns {
      convertTimestampToDate: [Function: convertTimestampToDate],
      myFunc2: [Function: convertTimestampToDate],
      NAME: 'Anything'
    }
*/

