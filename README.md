# exp-app

## Project setup
```
npm install
```

Generate and store JSON file containing Google Firebase Authentication credentials. Refer https://firebase.google.com/docs/admin/setup#initialize-sdk for more information.
Place JSON file in root folder of an application.

Update value of following cons in constant.js and save.
```
const FIRESTORE_AUTH_JSON = 'service-account-file.json';
const FIRESTORE_AUTH_URL = 'https://<DATABASE_NAME>.firebaseio.com';
```

## Run application
```
node index.js
```
