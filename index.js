'use strict';

var piCamera = require("./src/camera");
var Promise = require("promise");
var Gpio = require("pigpio").Gpio;

var sensor = new Gpio(23, {
  mode: Gpio.INPUT,
  alert: true
});
var hasMotion = false;

(() => {
  sensor.on('alert', () => {
    if (!hasMotion) {
      console.log("Motion Detected");
      hasMotion = true;
      delayDetection();

      piCamera.captureImage().then(data => {
        console.log(data);
      })
    }
  });
})();

var delayDetection = () => {
  setTimeout(() => {
    hasMotion = false;
  }, 60000);
};