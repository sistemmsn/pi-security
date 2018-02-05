var RaspiCam = require("raspicam");
var Promise = require("promise");

var camera = new RaspiCam({
  mode: "photo",
  output: "../output/room-pi_%d"
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