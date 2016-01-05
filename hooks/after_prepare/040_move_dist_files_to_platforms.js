#!/usr/bin/env node

/**
 * After prepare, files are copied to the platforms/ios and platforms/android folders.
 * Lets clean up some of those files that arent needed with this hook.
 */
var path = require('path');
var mv = require('mv');
var platform = process.env.CORDOVA_PLATFORMS;

function moveIosFolder() {
  var iosPlatformsDir_dist_css = path.resolve(__dirname, '../../platforms/ios/www/css');
  var iosPlatformsDir_annotated_js = path.resolve(__dirname, '../../platforms/ios/www/annotated_js');
  var iosPlatformsDir_dist_index = path.resolve(__dirname, '../../platforms/ios/www/index.html');
  var iosPlatformsDir_www_css = path.resolve(__dirname, '../../platforms/ios/www/css');
  var iosPlatformsDir_www_js = path.resolve(__dirname, '../../platforms/ios/www/annotated_js');
  var iosPlatformsDir_www_index = path.resolve(__dirname, '../../platforms/ios/www/index.html');
  console.log("Moving dist files to iOS platform");
  mv(iosPlatformsDir_dist_css, iosPlatformsDir_www_css, {
    mkdirp: true
  }, function(err) {
    if (typeof err != 'undefined') {
      console.info("***** ERROR *****");
      console.error(err);
      console.error("ERROR when moving CSS folder to iOS platform");
    } else {
      console.info("CSS folder moved OK to iOS platform");
    }
  });

  mv(iosPlatformsDir_annotated_js, iosPlatformsDir_www_js, {
    mkdirp: true
  }, function(err) {
    if (typeof err != 'undefined') {
      console.info("***** ERROR *****");
      console.error(err);
      console.error("ERROR when moving JS folder to iOS platform");
    } else {
      console.info("JS folder moved OK to iOS platform");
    }
  });

  mv(iosPlatformsDir_dist_index, iosPlatformsDir_www_index, function(err) {
    if (typeof err != 'undefined') {
      console.info("***** ERROR *****");
      console.error(err);
      console.error("ERROR when moving index.html file to iOS platform");
    } else {
      console.info("index.html file moved OK to iOS platform");
    }
  });
}

function moveAndroidFolder() {
  var androidPlatformsDir_dist_css = path.resolve(__dirname, '../../platforms/android/assets/www/dist/dist_css');
  var androidPlatformsDir_annotated_js = path.resolve(__dirname, '../../platforms/android/assets/www/dist/annotated_js');
  var androidPlatformsDir_dist_index = path.resolve(__dirname, '../../platforms/android/assets/www/dist/index.html');
  var androidPlatformsDir_www_css = path.resolve(__dirname, '../../platforms/android/assets/www/dist_css');
  var androidPlatformsDir_www_js = path.resolve(__dirname, '../../platforms/android/assets/www/annotated_js');
  var androidPlatformsDir_www_index = path.resolve(__dirname, '../../platforms/android/assets/www/index.html');

  console.log("Moving dist files to Android platform");
  mv(androidPlatformsDir_dist_css, androidPlatformsDir_www_css, {
    mkdirp: true
  }, function(err) {
    if (typeof err != 'undefined') {
      console.log("err");
      console.log(err);
      console.log("ERROR when moving CSS folder to Android platform");
    } else {
      console.log("CSS folder moved OK to Android platform");
    }

  });

  mv(androidPlatformsDir_annotated_js, androidPlatformsDir_www_js, {
    mkdirp: true
  }, function(err) {
    if (typeof err != 'undefined') {
      console.log("err");
      console.log(err);
      console.log("ERROR when moving JS folder to Android platform");
    } else {
      console.log("JS folder moved OK to Android platform");
    }
  });

  mv(androidPlatformsDir_dist_index, androidPlatformsDir_www_index, function(err) {
    if (typeof err != 'undefined') {
      console.log("err");
      console.log(err);
      console.log("ERROR when moving index.html file to Android platform");
    } else {
      console.log("index.html file moved OK to Android platform");
    }
  });
}

switch (platform) {
  case 'ios':
    // moveIosFolder();
    break;
  case 'android':
    // moveAndroidFolder();
    break;
  default:
    console.info('this hook only supports android and ios currently');
    return;
}
