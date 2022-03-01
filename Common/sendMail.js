const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const keys = require("../config/keys");

const sendMail = async (email, subject, text) => {
  const msg = {
    to: email, // Change to your recipient
    from: 'shweta@yopmail.com', // Change to your verified sender
    subject: subject,
    text: text,
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail
    .send(msg)
    .then(() => {
      return true;
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })

}
module.exports = sendMail