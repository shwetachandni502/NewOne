const express = require('express');
const routing = express.Router();
const user = require('../Controller/userController');

routing.all('*', user.inValid);

module.exports = routing;
