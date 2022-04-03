const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendMail = async (email, subject, text) => {
  const msg = {
    to: [email], // Change to your recipient
    from: 'shwetachandni502@gmail.com', // Change to your verified sender
    subject: subject,
    text: text,
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail
    .send(msg)
    .then(() => {
      // return true;
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
      return error.message
    })

}
module.exports = sendMail