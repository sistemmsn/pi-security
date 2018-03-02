require('dotenv').config();
var fs = require('fs');
var Promise = require("promise");
var admin = require('firebase-admin');

const serviceAccount = require("../config/firebase_acct.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});
const storage = admin.storage();
const db = admin.database();

exports.uploadImage = (filename, timestamp, location) => {
  const newName = timestamp + ".jpg";
  const bucket = storage.bucket("images");
  const destination = `${location}/${newName}`;

  var fileToUpload = bucket.file(`${__dirname}/output/${filename}`);

  const blobStream = fileToUpload.createWriteStream({
    metadata: {
      contentType: "image/jpeg"
    }
  });

  blobStream.on('error', (error) => {
    console.log(error);
  });

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
    const imageRef = db.ref(`images/${location}`);

    console.log(url);
    imageRef.set({
      imageUrl: url,
      timestamp: timestamp,
      name: newName
    });
  });
}