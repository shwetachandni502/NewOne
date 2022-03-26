const express = require('express');
const routing = express.Router();
const auth = require('../Controller/authController');

 routing.post('/signup', auth.signup);
 routing.post('/login', auth.login);
 routing.post('/phone/otp/verification', auth.phoneOtpVerification);
 routing.post('/email/otp/verification', auth.emailOtpVerification);
 routing.post('/email/otp/resend', auth.resendEmailOTP);
 routing.post('/phone/otp/resend', auth.resendPhoneOTP);
 routing.get('/data', auth.data);
 routing.all('*', auth.inValid);

module.exports = routing;
