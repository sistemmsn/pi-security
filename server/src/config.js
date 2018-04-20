var admin = require('firebase-admin');

const serviceAccount = require("../config/service_account.json");
const PROJECT_ID = serviceAccount.project_id;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});

module.exports = {
    PROJECT_ID: PROJECT_ID,
    admin: admin,
    LOCATION: 'bedroom'
};