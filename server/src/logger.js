const fs = require('fs');
const path = require('path');
const root = __dirname.split("src")[0];

var firebaseAdmin = require('./config').admin;
const db = firebaseAdmin.database();
var logRef = db.ref(`dataLogs/${LOCATION}/`);

exports.logMotion = (data) => {
  const filename = data.filename;
  const timestamp = data.timestamp;

  logRef.push(`${filename} was logged at ${new Date(timestamp).toLocaleString()}\n`);
}

exports.logStartup = () => {
  logRef.push(`Startup bedroom pi at ${new Date(timestamp).toLocaleString()}`)
}
