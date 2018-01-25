'use strict';

var Gpio = require('onoff').Gpio,
  pir = new Gpio(2, 'in');

setInterval(function () {
  pir.read(function(err, value) {
    if (err) {
      throw err;
    }

    console.log(value);
  });
}, 500);

// var Gpio = require('pigpio').Gpio;
// var trigger = new Gpio(23, {
//   mode: Gpio.OUTPUT
// });
// var echo = new Gpio(24, {
//   mode: Gpio.INPUT,
//   alert: true
// });

// // The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
// var MICROSECDONDS_PER_CM = 1e6 / 34321;

// trigger.digitalWrite(0); // Make sure trigger is low

// (function () {
//   var startTick;

//   console.log("Started program");
//   echo.on('alert', function (level, tick) {
//     var endTick, diff;
//     console.log(level, tick);
//     if (level == 1) {
//       startTick = tick;
//     } else {
//       endTick = tick;
//       diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
//       console.log(diff / 2 / MICROSECDONDS_PER_CM);
//     }
//   });
// }());

// // Trigger a distance measurement once per second
// setInterval(function () {
//   trigger.trigger(10, 1); // Set trigger high for 10 microseconds
// }, 1000);