var MagicHomeControl = require('magic-home').Control;
const Promise = require("promise");

var light = new MagicHomeControl("192.168.86.173");

module.exports = {
    turnOn: () => {
        return new Promise((resolve, reject) => {
            return light.turnOn((err, success) => {
                if (err) reject(err);
                resolve(success);
            });
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
module.exports.turnOff();