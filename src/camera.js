var RaspiCam = require("raspicam");
var Promise = require("promise");

var camera = new RaspiCam({
  mode: "photo",
  output: __dirname + "/output/room-pi_%d",
  quality: 100,
  width: 1920,
  height: 1080
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