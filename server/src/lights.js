var MagicHomeControl = require('magic-home').Control;
const Promise = require("promise");
const config = require('./src/config');

const firebaseAdmin = config.admin;
const db = firebaseAdmin.database();
const LOCATION = config.LOCATION;

var light = new MagicHomeControl("192.168.86.173");
var isDarkHours = false;
// TODO: Probably shouldn't be hardcoded

var settingsRef = db.ref(`settings/${LOCATION}/`);
settingsRef.child('isDarkHours').on('value', snap => {
    if (snap.exists()) {
        isDarkHours = snap.val();
    }
});

module.exports = {
    turnOn: (isRemote) => {
        return new Promise((resolve, reject) => {
            // const hour = new Date().getHours();
            // TODO: Make this variable a setting in Mobile App
            if (!isRemote && isDarkHours) { // If the hours are between 11pm and 9am you may not want to be disturbed
                resolve("Dark Hours");
            } else {
                return light.turnOn((err, success) => {
                    if (err) reject(err);
                    resolve(success);
                });
            }
        });
    },
    turnOff: () => {
        return new Promise((resolve, reject) => {
            return light.turnOff((err, success) => {
                if (err) reject(err);
                resolve(success);
            });
        });
    },
    setColor: (red, green, blue) => {
        return new Promise((resolve, reject) => {
            return light.setColorWithBrightness(red, green, blue, 100, (err, success) => {
                if (err) reject(err);
                resolve(success);
            });
        });
    }

}