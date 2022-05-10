const express = require('express');
const routing = express.Router();
const auth = require('../Controller/authController');
const Middleware = require('../Middleware/fun')

 routing.post('/signup', auth.signup);
 routing.post('/login', auth.login);
 routing.post('/phone/otp/verification', auth.phoneOtpVerification);
 routing.post('/email/otp/verification', auth.emailOtpVerification);
 routing.put('/profile/update',  auth.profileSetup);
 routing.get('/profile/get', Middleware.authenticateToken, auth.getProfile);
 routing.post('/email/otp/resend', auth.resendEmailOTP);
 routing.post('/phone/otp/resend', auth.resendPhoneOTP);
 routing.post('/forgot/password', auth.forgotPassword);
 routing.post('/reset/password',Middleware.authenticateToken, auth.resetPassword);
 routing.post('/change/password',Middleware.authenticateToken, auth.changePassword);
 routing.get('/data', auth.data);
 routing.all('*', auth.inValid);

module.exports = routing;
