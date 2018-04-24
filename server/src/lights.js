var MagicHomeControl = require('magic-home').Control;
const Promise = require("promise");

var light = new MagicHomeControl("192.168.86.173");
// TODO: Probably shouldn't be hardcoded

module.exports = {
    turnOn: () => {
        return new Promise((resolve, reject) => {
            const hour = new Date().getHours();
            // TODO: Make this variable a setting in Mobile App
            if (hour <= 9 || hour >= 23) { // If the hours are between 11pm and 9am you may not want to be disturbed
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