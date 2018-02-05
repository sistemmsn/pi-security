'use strict';

// Code snippet from 
var Gpio = require('pigpio').Gpio;
var sensor = new Gpio(23, {
  mode: Gpio.INPUT,
  alert: true
});

(function checkForObstacle() {
  var startTick, distance = 0;

  sensor.on('alert', function (level, tick) {
    console.log(level, tick);
    console.log("Motion Detected");ß
  });
})();