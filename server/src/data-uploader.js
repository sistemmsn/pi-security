require('dotenv').config();
var fs = require('fs');
var Promise = require("promise");
var admin = require('firebase-admin');

const serviceAccount = require("../config/service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});
const storage = admin.storage();
const db = admin.database();
const PROJECT_ID = serviceAccount.project_id;

exports.uploadImage = (filename, timestamp, location) => {
  const newName = timestamp + ".jpg";
  const bucket = storage.bucket(PROJECT_ID + '.appspot.com');
  const destination = `${location}/${newName}`;
  const imageRef = db.ref(`images/${location}`);

  const options = {
    destination: destination,
    public: true,
    metadata: {
      contentType: "image/jpeg"
    }
  };

  return bucket.upload(`${__dirname}/output/${filename}`, options)
    .then(res => res[0])
    .then(res => {
      // The public URL can be used to directly access the file via HTTP.
      const url = `https://storage.googleapis.com/${bucket.name}/${res.name}`;

      return {
        imageUrl: url,
        timestamp: timestamp,
        name: newName
      };
    })
    .catch(err => {
      return { error: err };
    })
    .then(data => {
      return imageRef.push(data);
    });
}