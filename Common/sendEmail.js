
var nodemailer = require('nodemailer');
const sendEmail = async (email, subject, text) => {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sonaliray4000@gmail.com',
      pass: 'Arighna@12345'
    }
  });
  
  var mailOptions = {
    from: 'sonaliray4000@gmail.com',
    to: email,
    subject,
    text,
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      return info.response
    }
  });

}
module.exports = sendEmail