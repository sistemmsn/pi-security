'use strict';

const functions = require('firebase-functions');
const vision = require('@google-cloud/vision');
const gcs = require('@google-cloud/storage')();
const admin = require('firebase-admin');

admin.initializeApp();

// Creates a client
const client = new vision.ImageAnnotatorClient();

exports.imageToJPG = functions.storage.object().onFinalize((object) => {
  const bucket = object.bucket;
  const fileName = object.name;
  console.log(object);
  const fileUri = `gs://${bucket}/${fileName}`;
  const key = fileName.split('.')[0];

  // Performs face detection on the gcs file
  return client.faceDetection(fileUri)
    .then(results => {
      const faces = results[0].faceAnnotations;
      var data = [];
      faces.forEach((face, i) => {
        data.push({
          face: i + 1,
          joy: face.joyLikelihood,
          anger: face.angerLikelihood,
          sorrow: face.sorrowLikelihood,
          surprise: face.surpriseLikelihood
        })
      });

      // TODO: Remove hardcoded room
      return admin.database().ref(`infoLogs/bedroom/${key}`).set(data)
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
});