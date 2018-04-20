require('dotenv').config();
var fs = require('fs');
var Promise = require("promise");
var firebaseAdmin = require('./config').admin;

const storage = firebaseAdmin.storage();
const db = firebaseAdmin.database();
const PROJECT_ID = serviceAccount.project_id;

exports.uploadImage = (filename, timestamp, location) => {
  const newName = parseInt(timestamp / 1000) + ".jpg";
  const bucket = storage.bucket(PROJECT_ID + '.appspot.com');
  const imageRef = db.ref(`imageLogs/${location}`);

  const options = {
    destination: newName,
    public: true
  };

  return bucket.upload(`${__dirname}/output/${filename}`, options)
    .then(res => res[0])
    .then(res => {
      // The public URL can be used to directly access the file via HTTP.
      const url = `https://storage.googleapis.com/${bucket.name}/${res.name}`;

      return {
        imageUrl: url,
        timestamp: timestamp
      };
    })
    .catch(err => {
      return { error: err };
    })
    .then(data => {
      return imageRef.push(data);
    });
}