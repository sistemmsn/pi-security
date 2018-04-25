require('dotenv').config();
var fs = require('fs');
var Promise = require("promise");
var firebaseAdmin = require('./config');

const storage = firebaseAdmin.admin.storage();
const db = firebaseAdmin.admin.database();

exports.uploadImage = (filename, timestamp, location, key) => {
  const newName = key + ".jpg";
  const bucket = storage.bucket(firebaseAdmin.PROJECT_ID + '.appspot.com');
  const imageRef = db.ref(`imageLogs/${location}/${key}`);

  const options = {
    destination: newName,
    public: true,
  };

  return bucket.upload(`${__dirname}/output/${filename}`, options)
    .then(res => res[0])
    .then(res => {
      // The public URL can be used to directly access the file via HTTP.
      const url = `https://storage.googleapis.com/${bucket.name}/${res.name}`;

      return imageRef.set({
        imageUrl: url,
        timestamp: Math.floor(timestamp / 1000)
      });
    });
}