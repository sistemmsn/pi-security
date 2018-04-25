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
  const fileUri = `gs://${bucket}/${fileName}`;
  const key = fileName.split('.')[0];

  // Performs face detection on the gcs file
  var facePromise = client.faceDetection(fileUri);
  var labelPromise = client.labelDetection(fileUri);
  var logoPromise = client.logoDetection(fileUri);

  Promise.all([facePromise, labelPromise, logoPromise])
    .then(results => {
      var data = {};
      results = results[0];
      data['face'] = results[0].faceAnnotations;
      data['label'] = results[1].labelAnnotations;
      data['logo'] = results[2].logoAnnotations;
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
      return admin.database().ref(`dataLogs/bedroom/${key}`).update(data)
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

  
});