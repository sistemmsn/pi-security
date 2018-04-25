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
const LOCATION = config.LOCATION;

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

  logSettings();
  remoteCaptureImage();
  dbLogger.logStartup();

  // Listen to event when sensor's value changes (0 or 1)
  sensor.on('alert', () => {
    if (isLogging && !hasMotion) {
      hasMotion = true;
      saveImage(null);
    }
  });
})();

function logSettings() {
  var settingsRef = db.ref(`settings/${LOCATION}/`);

  // Listen to event when the value of isLogging changes (true or false)
  settingsRef.child('isLogging').on('value', snap => {
    if (snap.exists()) {
      isLogging = snap.val();
    }
  });
}

function remoteCaptureImage() {
  var remoteRef = db.ref(`settings/${LOCATION}/`);

  // Listen to event when value for takeImage changes (true or false)
  remoteRef.child('takeImage').on('value', snap => {
    if (snap.val()) {
      remoteRef.update({
        takeImage: false
      })
      saveImage(true);
    }
  })
}

/**
 * Turn on the room light, then take a pic, turn off the light
 * Delay for next motion detection, log the image and file timestamp
 */
var saveImage = (isRemote) => {
  roomLight.turnOn(isRemote)
    .then(() => {
      piCamera.captureImage().then(data => {
        roomLight.turnOff();
        delayDetection();
        return dbLogger.logMotion(data)
          .then(info => {
            imgUploader.uploadImage(data.filename, data.timestamp, LOCATION, info.key);
          })
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
  }, 15000);
};