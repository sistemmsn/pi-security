'use strict';

const functions = require('firebase-functions');
const vision = require('@google-cloud/vision');
const gcs = require('@google-cloud/storage')();

// Creates a client
const client = new vision.ImageAnnotatorClient();
vision = vision();

exports.imageToJPG = functions.storage.object().onChange((event) => {
  const object = event.data;
  const filePath = object.name;
  const fileUri = `gs://${bucketName}/${fileName}`;

  // Exit if this is a move or deletion event.
  if (object.resourceState === 'not_exists') {
    return console.log('This is a deletion event.');
  }

  // Performs face detection on the gcs file
  client.faceDetection(fileUri)
    .then(results => {
      const faces = results[0].faceAnnotations;

      console.log('Faces:');
      faces.forEach((face, i) => {
        console.log(`  Face #${i + 1}:`);
        console.log(`    Joy: ${face.joyLikelihood}`);
        console.log(`    Anger: ${face.angerLikelihood}`);
        console.log(`    Sorrow: ${face.sorrowLikelihood}`);
        console.log(`    Surprise: ${face.surpriseLikelihood}`);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
});