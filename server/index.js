'use strict';

const piCamera = require("./src/camera");
const imgUploader = require('./src/data-uploader');
const fileLogger = require('./src/logger');
const Promise = require("promise");
const Gpio = require("pigpio").Gpio;

// NOTE: Input is GPIO23 assuming you are using the BCM numbering
const sensor = new Gpio(23, {
  mode: Gpio.INPUT,
  alert: true
});
const trigger = new Gpio(11, { // 23
  mode: Gpio.OUTPUT
});
const echo = new Gpio(8, { // 24
  mode: Gpio.INPUT,
  alert: true
});
// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6 / 34321;

var hasMotion = false;

trigger.digitalWrite(0); // Make sure trigger is low

(() => {

  var startTick, distance = 0;

  console.log("Started program");
  sensor.on('alert', () => {
    if (!hasMotion) {
      hasMotion = true;
      delayDetection();

      if (checkProximity()) {
        piCamera.captureImage().then(data => {
          fileLogger.logMotion(data);
          imgUploader.uploadImage(data.fileName, data.timestamp, 'bedroom');
        }).catch(err => {
          console.log(err.message);
        })
      }
    }
  });
})();

const delayDetection = () => {
  setTimeout(() => {
    hasMotion = false;
  }, 60000);
};

// Trigger a distance measurement once per second
setInterval(() => {
  trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 500);

/**
 * Check if an object is in the range of the distance sensor.
 * returns boolean if distance is 
 */
const checkProximity = () => {
  return true;
  // echo.on('alert', (level, tick) => {
  //   var endTick, diff;

  //   if (level == 1) {
  //     startTick = tick;
  //   } else {
  //     endTick = tick;
  //     diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
  //     distance = diff / 2 / MICROSECDONDS_PER_CM;
  //   }

  //   // If distance of object is between 2cm and 3m, return true, else false
  //   return (distance > 2 && distance < 300) ? true : false;
  // });
}