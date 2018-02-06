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
  const newName =  timestamp + ".jpg";
  const bucket = storage.bucket("images");
  const destination = `${location}/${newName}`;

  return bucket.upload(filename, { destination: destination })
    .then(res => {
      var imageRef = db.ref(`images/${location}`);

      bucket.file(destination).getMetadata().then(results => {
        const metadata = results[0];
        const imageUrl = metadata.selfLink;
        imageRef.set({
          imageUrl: imageUrl,
          timestamp: curTime,
          name: newName
        })
      })
    });
}