'use strict';

const piCamera = require("./src/camera");
const imgUploader = require('./src/data-uploader');
const dbLogger = require('./src/logger');
const roomLight = require('./src/lights');
const Promise = require("promise");
const Gpio = require("pigpio").Gpio;
const config = require('./src/config');

const firebaseAdmin = config.admin;
const db = firebaseAdmin.database();

// NOTE: Input is GPIO23 assuming you are using the BCM numbering
const sensor = new Gpio(23, { // 16
  mode: Gpio.INPUT,
  alert: true
});

var hasMotion = false;
var isLogging = false;

/**
 * Check if an object is in the range of the motion sensor.
 */
(() => {
  console.log("Started program");

  logSetting();
  remoteCaptureImage();
  dbLogger.logStartup();

  // Listen to event when sensor's value changes (0 or 1)
  sensor.on('alert', () => {
    if (isLogging && !hasMotion) {
      console.log("Motion detected");
      hasMotion = true;
      saveImage();
    }
  });
})();

var logSetting = () => {
  var settingsRef = db.ref(`settings/${LOCATION}/`);

  // Listen to event when the value of isLogging changes (true or false)
  settingsRef.child('isLogging').on('value', snap => {
    if (snap.exists()) {
      isLogging = snap.val();
    }
  });
}

var remoteCaptureImage = () => {
  var remoteRef = db.ref(`controls/${LOCATION}/`);

  // Listen to event when value for takeImage changes (true or false)
  remoteRef.child('takeImage').on('child_changed', snap => {
    if (snap.exists() && snap.val()) {
      remoteRef.child('lastImageTimestamp').set(new Date().toLocaleString())
      saveImage();
    }
  })
}

/**
 * Turn on the room light, then take a pic, turn off the light
 * Delay for next motion detection, log the image and file timestamp
 */
var saveImage = () => {
  roomLight.turnOn()
    .then(() => {
      piCamera.captureImage().then(data => {
        roomLight.turnOff();
        delayDetection();
        dbLogger.logMotion(data);
        return imgUploader.uploadImage(data.filename, data.timestamp, LOCATION);
      }).catch(err => {
        console.log(err);
      })
    })
}

// Delay for a minute till motion can be "detected"
const delayDetection = () => {
  setTimeout(() => {
    if (hasMotion) {
      hasMotion = false;
      console.log("Reset motion");
    }
  }, 60000);
};