var RaspiCam = require("raspicam");
var Promise = require("promise");

var camera = new RaspiCam({
  // mode: "photo",
	mode: "timelapse",
  output: __dirname + "/output/room-pi_%02d.jpg",
  quality: 100,
  width: 1920,
  height: 1080,
  rotation: 90,
	encoding: "jpg",
	timelapse: 3000, // take a picture every 3 seconds
	timeout: 12000 // take a total of 4 pictures over 12 seconds
});

exports.captureImage = () => {
  var isCapturingImage = camera.start();
  return new Promise((resolve, reject) => {
    if (!isCapturingImage) reject({ error: "Can't take an image."})
    camera.on("read", (err, timestamp, filename) => {
      if (err) reject({error: err});

      resolve({
        timestamp: timestamp,
        fileName: filename
      });
    })
  });
}