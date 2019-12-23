const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const constants = require('./constant');
const events = require('./db/events');
const users = require('./db/users');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Assignment Test'
    });
});

app.post('/signup', (req, res) => {
	users.createAccount(req.body.username, req.body.password).then((userRes) => {
		res.json(userRes);
	}).catch((userRes)=> {
		res.json(userRes);
	});
});

app.post('/login', (req, res) => {
	users.login(req.body.username, req.body.password).then((userRes) => {
		res.json(userRes);
	}).catch((userRes) => {
		res.json(userRes);
	});
});

app.post('/events', (req, res) => {
	let token = req.header('Authorization');
	users.validate(token).then((userRes) => {
		events.createEvent(userRes['email'], req.body.date, req.body.time, constants.DURATION).then((eventRes) => {
			res.json(eventRes);
		}).catch((eventRes) => {
			res.json(eventRes);
		});
	}).catch((userRes) => {
		res.json(userRes);
	});
});

app.get('/events', (req, res) => {
	let token = req.header('Authorization');
	users.validate(token).then((userRes) => {
		events.getEvents(userRes['email'], req.query.start_date, req.query.end_date).then((eventRes) => {
			res.json(eventRes);
		}).catch((eventRes) => {
			res.json(eventRes);
		});
	}).catch((userRes) => {
		res.json(userRes);
	});
});

app.get('/freeSlots', (req, res) => {
	let token = req.header('Authorization');
	users.validate(token).then((userRes) => {
		events.getFreeSlots(userRes['email'], req.query.date, constants.START_TIME, constants.END_TIME, constants.DURATION, 'minutes').then((eventRes) => {
			res.json(eventRes);
		}).catch((eventRes) => {
			res.json(eventRes);
		});
	}).catch((userRes) => {
		res.json(userRes);
	});
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});