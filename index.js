'use strict';

const piCamera = require("./src/camera");
const imgUploader = require('./src/data-uploader');
const Promise = require("promise");
const Gpio = require("pigpio").Gpio;

// NOTE: Input is GPIO23 assuming you are using the BCM numbering
const sensor = new Gpio(23, {
  mode: Gpio.INPUT,
  alert: true
});
var hasMotion = false;

(() => {
  sensor.on('alert', () => {
    if (!hasMotion) {
      console.log("Motion Detected");
      hasMotion = true;
      delayDetection();   // Don't

      piCamera.captureImage().then(data => {
        const fileName = data.fileName;
        const timestamp = data.timestamp;
        imgUploader.uploadImage(fileName, timestamp, 'bedroom');
      }).catch(err => {
        console.log(err.message);
      })
    }
  });
})();

const delayDetection = () => {
  setTimeout(() => {
    hasMotion = false;
  }, 60000);
};