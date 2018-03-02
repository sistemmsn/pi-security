var RaspiCam = require("raspicam");
var Promise = require("promise");

var camera = new RaspiCam({
  mode: "photo",
  output: __dirname + "/output/room-pi.jpg",
  quality: 100,
  width: 1920,
  height: 1080,
  rotation: 90,
  encoding: "jpg",
  timeout: 0
});

const imgErrorMessage = "Can't take an image.";

exports.captureImage = () => {
  var isCapturingImage = camera.start();
  return new Promise((resolve, reject) => {
    if (!isCapturingImage) reject({ message: imgErrorMessage });

    camera.on("read", (err, timestamp, filename) => {
      camera.stop();
      if (err) reject({ message: imgErrorMessage, error: err });

      resolve({
        timestamp: timestamp / 1000, // Convert from milliseconds
        fileName: filename
      });
    })
  });
}