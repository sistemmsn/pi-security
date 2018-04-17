var RaspiCam = require("raspicam");
var Promise = require("promise");

var picture = new RaspiCam({
  mode: "photo",      // Or timelapse
  output: __dirname + "/output/room-pi.jpg",    // Add %d if timelapse for int increments.
  quality: 100,
  width: 1920,
  height: 1080,
  rotation: 90,
  encoding: "jpg",
  timeout: 0
});

var video = new RaspiCam({
  mode: "video",
  output: __dirname + "/output/image_stream.jpg",
  width: 640,
  height: 480,
  framerate: 20,
  timeout: 999999999
})

const imgErrorMessage = "Can't take an image.";

exports.captureImage = () => {
  var isCapturingImage = picture.start();
  return new Promise((resolve, reject) => {
    if (!isCapturingImage) reject({ message: imgErrorMessage });

    picture.on("read", (err, timestamp, filename) => {
      picture.stop();
      if (err) reject({ message: imgErrorMessage, error: err });

      resolve({
        timestamp: timestamp,
        filename: filename
      });
    })
  });
}