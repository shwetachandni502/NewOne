const express = require('express');
const routing = express.Router();
const auth = require('../Controller/authController');

 routing.post('/signup', auth.signup);
 routing.post('/login', auth.login);
 routing.post('/data', auth.data);
 routing.all('*', auth.inValid);

module.exports = routing;
