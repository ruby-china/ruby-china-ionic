#!/usr/bin/env node

/**
 * After prepare, files are copied to the platforms/ios and platforms/android folders.
 * Lets clean up some of those files that arent needed with this hook.
 */
var fs = require('fs');
var path = require('path');
var platform = process.env.CORDOVA_PLATFORMS;

var deleteFolderRecursive = function(removePath) {
  if (fs.existsSync(removePath)) {
    fs.readdirSync(removePath).forEach(function(file, index) {
      var curPath = path.join(removePath, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(removePath);
  }
};

var iosPlatformsDir_dist = path.resolve(__dirname, '../../platforms/ios/www/dist');
var androidPlatformsDir_dist = path.resolve(__dirname, '../../platforms/android/assets/www/dist');

switch (platform) {
  case 'ios':
    deleteFolderRecursive(iosPlatformsDir_dist);
    break;
  case 'android':
    deleteFolderRecursive(androidPlatformsDir_dist);
    break;
  default:
    console.info('this hook only supports android and ios currently');
    return;
}


