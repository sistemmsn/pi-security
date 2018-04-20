var admin = require('firebase-admin');

const serviceAccount = require("../config/service_account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});

module.exports = {
    admin: admin
};