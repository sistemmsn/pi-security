'use strict';

var piCamera = require("./src/camera");
var Promise = require("promise");
var Gpio = require("pigpio").Gpio;
var sensor = new Gpio(23, {
  mode: Gpio.INPUT,
  alert: true
});

(() => {
  sensor.on('alert', () => {
    console.log("Motion Detected");

    piCamera.captureImage().then(data => {
      console.log(data);
    })
  });
})();