const db = require('./connection');
var moment = require('moment');

function getTimeLabels(startTime, endTime, format, interval, period) {
	const startTimeMoment = moment(startTime, format);
	const endTimeMoment = moment(endTime, format);
	const timeLabels = [];
	do {
		timeLabels.push(startTimeMoment.format(format));
		startTimeMoment.add(interval, period);
	} while(startTimeMoment < endTimeMoment);
	
	return timeLabels;
}

function getFreeSlots(email, date, startTime, endTime, duration, period) {
	return new Promise((resolve, reject) => {
		let timeSlots = getTimeLabels(startTime, endTime, 'HH:mm:ss', duration, period);
		let dateRef = db.collection('accounts').doc(email).collection('events').doc(date);
		let getDoc = dateRef.get()
			.then(doc => {
				for (time in doc.data()) {
					let timeIdx = timeSlots.indexOf(time);
					timeSlots.splice(timeIdx, 1);
				}
				resolve({
					'status': 'success',
					'msg': timeSlots
				});
			})
			.catch((err) => {
				resolve({
					'status': 'error',
					'msg': 'Exception'
				});
			});
	});
}

function getEventList(email, dateList) {
	let eventList = [];
	for(date of dateList) {
		eventList.push(db.collection('accounts').doc(email).collection('events').doc(date).get());
	}
	return eventList;
}

function getEvents(email, startDate, endDate) {
	return new Promise((resolve, reject) => {
		let dateList = getTimeLabels(startDate, endDate, 'YYYY-MM-DD', 1, 'day');
		let eventList = getEventList(email, dateList);
    let eventMap = {};
		Promise.all(eventList.map(event => event.then((doc) => {
			if (doc) {
        eventMap[doc.id] = doc.data() ? doc.data() : {};
			}
		}))).then(() => {
			resolve({
				'status':'success',
				'msg': eventMap
			});
		}).catch(() => {
			reject({
				'status':'error',
				'msg': 'Error getting events'
			});
		});
	});
	
}

function createEvent(email, date, time, duration) {
	return new Promise((resolve, reject) => {
		let timeHash = {};
		timeHash[time] = {'duration': duration};
		let dateRef = db.collection('accounts').doc(email).collection('events').doc(date);
		let getDoc = dateRef.get()
			.then(doc => {
			if (!doc.exists) {
				dateRef.create(timeHash).then((res) => {
					resolve({
						'status':'success', 'msg':'Event created.'
					});
				});
			} else {
        if(doc.get(time) != null) {
          reject({
            'status':'error', 'msg':'Event already exists.'
          });
        } else {
          let setWithOptions = dateRef.update(timeHash);
          resolve({
            'status':'success', 'msg':'Event created.'
          });
        }
			}
		})
		.catch(err => {
			reject({
				'status':'error', 'msg':'Error in event creation.'
			});
		});
	});
}

module.exports = {
	getFreeSlots,
    getEvents,
    createEvent
};