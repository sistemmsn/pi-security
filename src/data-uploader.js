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

  return bucket.upload(`output/${filename}`, {
      destination: destination
    })
    .then(res => {
      var imageRef = db.ref(`images/${location}`);
      console.log(destination, res.toString());

      return bucket.file(destination).getMetadata().then(results => {
        const metadata = results[0];
        const imageUrl = metadata.selfLink;
        var data = {
          imageUrl: imageUrl,
          timestamp: curTime,
          name: newName
        };
        console.log(data);
        return imageRef.set(data);
      })
    });
}