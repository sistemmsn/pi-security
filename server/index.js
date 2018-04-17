'use strict';

const piCamera = require("./src/camera");
const imgUploader = require('./src/data-uploader');
const fileLogger = require('./src/logger');
const roomLight = require('./src/lights');
const calculator = require('./src/distance-calculator');
const Promise = require("promise");
const Gpio = require("pigpio").Gpio;

// NOTE: Input is GPIO15 assuming you are using the BCM numbering
const sensor = new Gpio(14, { // 8
  mode: Gpio.INPUT,
  alert: true
});

var hasMotion = false;

/**
 * Check if an object is in the range of the motion sensor.
 */
(() => {
  console.log("Started program");
  sensor.on('alert', () => {
    console.log("Motion detected");
    if (!hasMotion) {
      hasMotion = true;
      saveImage();
    }
  });
})();

/**
 * Turn on the room light, then take a pic, turn off the light
 * Delay for next motion detection, log the image and file timestamp
 */
var saveImage = () => {
  if (!hasMotion) {
    hasMotion = true;
    roomLight.turnOn()
      .then(() => {
        piCamera.captureImage().then(data => {
          roomLight.turnOff();
          delayDetection();
          fileLogger.logMotion(data);
          return imgUploader.uploadImage(data.filename, data.timestamp, 'bedroom');
        }).catch(err => {
          console.log(err);
        })
      })
  }
}

// Delay for a minute till motion can be "detected"
const delayDetection = () => {
  setTimeout(() => {
    if (hasMotion) {
      hasMotion = false;
    }
  }, 60000);
};