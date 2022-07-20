const fs = require('fs');

const getFileExtension = (filename) => {
  let arr = filename.split('.');
  let lastChar = arr.length - 1;
  return arr[lastChar];
};

const deleteFile = (filename) => {
  if (fs.existsSync(filename)) return fs.unlinkSync(filename);
}

module.exports = {
  getFileExtension,
  deleteFile
};