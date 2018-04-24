const fs = require('fs');
const path = require('path');
const root = __dirname.split("src")[0];
const config = require('./config');

var firebaseAdmin = config.admin;
const db = firebaseAdmin.database();
const LOCATION = config.LOCATION;
var logRef = db.ref(`dataLogs/${LOCATION}/`);

exports.logMotion = (data) => {
  const filename = data.filename;
  const timestamp = Math.floor(data.timestamp/1000);

  return logRef.push({
    eventType: 'log',
    timestamp: timestamp
  });
}

exports.logStartup = () => {
  return logRef.push({
    eventType: 'startup',
    timestamp: Math.floor((new Date).getTime()/1000)
  });
}
