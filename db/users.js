const db = require('./connection');
var jwt = require('jsonwebtoken');
const constants = require('../constant');

function createAccount(email, password) {
	return new Promise((resolve, reject) => {
		let tokenPayload = { email: email, password: password };
		let token = jwt.sign(tokenPayload, constants.JWT_KEY);
		let accRef = db.collection('accounts').doc(email);
		let getDoc = accRef.get()
			.then(doc => {
				if (!doc.exists) {
					accRef.create(tokenPayload).then((res) => {
						resolve({'status':'success', 'msg':token});
					}).catch((res) => {
						reject({'status':'error', 'msg':'Error creating account.'});
					});
				} else {
					let setWithOptions = accRef.update(tokenPayload);
					resolve({'status':'success', 'msg':token});
				}
		})
		.catch(err => {
			console.log('Error getting document', err);
			reject({'status':'error', 'msg':'Error creating account.'});
		});
	});
}

function validate(token) {
	return new Promise((resolve, reject) => {
		try {
			var decoded = jwt.verify(token, constants.JWT_KEY);
			resolve({
				'status':'success',
				'email': decoded['email']
			});
		} catch(err) {
			reject({
				'status':'error',
				'msg': 'Invalid token'
			});
		}
	});
}

function login(email, password) {
	return new Promise((resolve, reject) => {
		let accRef = db.collection('accounts').doc(email);
		let getDoc = accRef.get()
			.then(doc => {
				if (email == doc.id && password == doc.data()['password']) {
					var token = jwt.sign({ email: email, password: password }, constants.JWT_KEY);
					resolve({
						'status':'success',
						'msg': token
					});
				} else {
					reject({
						'status':'error',
						'msg': 'Invalid token.'
					});
				}
			})
			.catch((err) => {
				reject({
					'status':'error',
					'msg': 'Error in login. Check your credentials.'
				});
			});
	});
}

module.exports = {
	createAccount,
    validate,
    login
};