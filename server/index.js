'use strict';

const piCamera = require("./src/camera");
const imgUploader = require('./src/data-uploader');
const fileLogger = require('./src/logger');
const Promise = require("promise");
const Gpio = require("pigpio").Gpio;

// NOTE: Input is GPIO23 assuming you are using the BCM numbering
const sensor = new Gpio(23, { // 16 for Board numbering
  mode: Gpio.INPUT,
  alert: true
});
const echo = new Gpio(15, { // 10
  mode: Gpio.INPUT,
  alert: true
});
const trigger = new Gpio(14, { // 8 for Board numbering
  mode: Gpio.OUTPUT
});
// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6 / 34321;

var hasMotion = false;
var arrDistance = [];
var polledDistance = 0;

trigger.digitalWrite(0); // Make sure trigger is low

(() => {

  var startTick, distance = 0;

  console.log("Started program");
  if (checkProximity()) {
    sensor.on('alert', () => {

      if (!hasMotion) {
        hasMotion = true;
        delayDetection();

        piCamera.captureImage().then(data => {
          fileLogger.logMotion(data);
          imgUploader.uploadImage(data.fileName, data.timestamp, 'bedroom');
        }).catch(err => {
          console.log(err.message);
        })
      }
    });
  }
})();

const delayDetection = () => {
  setTimeout(() => {
    hasMotion = false;
  }, 60000);
};

// Trigger a distance measurement once per second
setInterval(() => {
  trigger.trigger(10, 1); // Set trigger high for 10 microseconds and level to 1
}, 70);

/**
 * Check if an object is in the range of the distance sensor.
 * @returns A boolean true if distance is between 2 and 300cm
 */
const checkProximity = () => {
  echo.on('alert', (level, tick) => {
    var endTick, diff, distance;

    if (level == 1) {
      startTick = tick;
    } else {
      endTick = tick;
      diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      distance = diff / 2 / MICROSECDONDS_PER_CM;
      arrDistance.push(distance); // Push the distance into an array
      console.log(distance, "CM");
    }

    if (arrDistance.length > 10) {
      arrDistance.sort();           // Sort the number array in ascending order
      arrDistance.forEach(dist => { // Loop through and add the polled distance
        polledDistance += dist;
      })
      arrDistance = [];
      polledDistance /= 10;
    } else {
      polledDistance = 0;
    }

    // If distance of object is between 2cm and 3m, return true, else false
    return (polledDistance > 2 && polledDistance < 300) ? true : false;
  });
}