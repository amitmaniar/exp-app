var admin = require("firebase-admin");
const constants = require('../constant');

var serviceAccount = require("../" + constants.FIRESTORE_AUTH_JSON);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: constants.FIRESTORE_AUTH_URL
});

let db = admin.firestore();
module.exports = db;
