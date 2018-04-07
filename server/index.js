'use strict';

const piCamera = require("./src/camera");
const imgUploader = require('./src/data-uploader');
const fileLogger = require('./src/logger');
const roomLight = require('./src/lights');
const Promise = require("promise");
const Gpio = require("pigpio").Gpio;

// NOTE: Input is GPIO15 assuming you are using the BCM numbering
const echo = new Gpio(15, { // 10
  mode: Gpio.INPUT,
  alert: true
});
const trigger = new Gpio(14, { // 8 for Board numbering
  mode: Gpio.OUTPUT
});
// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
var MICROSECDONDS_PER_CM = 1e6 / 34321;

var hasMotion = false;
var arrDistance = [];
var polledDistance = 0;
var arrPolledDistance = []; // FIFO array that can only hold 10 polled values at a time

trigger.digitalWrite(0); // Make sure trigger is low

// Trigger a distance measurement every 65ms
setInterval(() => {
  trigger.trigger(10, 1); // Set trigger high for 10 microseconds and level to 1
}, 65);

/**
 * Check if an object is in the range of the distance sensor.
 * @returns A distance value
 */
(() => {
  var startTick, distance = 0;

  console.log("Started program");
  echo.on('alert', (level, tick) => {
    var endTick, diff;

    if (level == 1) {
      startTick = tick;
    } else {
      endTick = tick;
      diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      distance = diff / 2 / MICROSECDONDS_PER_CM;
      arrDistance.push(distance); // Push the distance into an array
    }

    // If the sample size of distances is 4 or higher
    if (arrDistance.length > 4) {
      polledDistance = parseFloat(median(arrDistance).toFixed(2)); // Get the most likely value from
      console.log("POLLED: " + polledDistance + "cm");
      arrPolledDistance.push(polledDistance);
      arrDistance = [];

      if (arrPolledDistance.length > 10) {
        arrPolledDistance.shift(); // remove the first element in the array.
        if (isDistanceDeviating(arrPolledDistance)) {
          saveImage(polledDistance);
        }
      }
    } else {
      polledDistance = 0;
    }

    return polledDistance;
  });
})();

var saveImage = (distance) => {
  if (!hasMotion) {
    hasMotion = true;
    roomLight.turnOn()
      .then(() => {
        piCamera.captureImage().then(data => {
          delayDetection();
          roomLight.turnOff();
          fileLogger.logMotion(data);
          return imgUploader.uploadImage(data.filename, data.timestamp, 'bedroom', distance);
        }).catch(err => {
          console.log(err);
        })
      })
  }
}

const delayDetection = () => {
  setTimeout(() => {
    hasMotion = false;
  }, 60000);
};

// Source: https://gist.github.com/caseyjustus/1166258
var median = (values) => {
  values.sort((a, b) => {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];
  else
    return (values[half - 1] + values[half]) / 2.0;
}

var isDistanceDeviating = (values) => {
  // Using 5 for no real reason, as program is developed a more suitable number will be used.
  // console.log("DEVIATION: ", standardDeviation(values).toFixed(2));
  return standardDeviation(values) > 5 ? true : false;
}

/**
 * Use standard deviation to check if a value deviates from the polled distances
 */
var standardDeviation = (values) => {
  var avg = average(values);

  var squareDiffs = values.map(function (value) {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

var average = (data) => {
  var sum = data.reduce(function (sum, value) {
    return sum + value;
  }, 0);

  return sum / data.length;
}