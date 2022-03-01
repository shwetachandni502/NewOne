const { Client } = require ("@sendgrid/client");
const sgMail = require("@sendgrid/mail");

// Test setClient() method
sgMail.setClient(new Client());

// Test setApiKey() method
sgMail.setApiKey("AIzaSyD5qYHiKnm8iIHFa-f_M9FFDdPY7dkfC6Y");

// Test setSubstitutionWrappers() method
sgMail.setSubstitutionWrappers("{{", "}}")

// Test send() method
sgMail.send({
  from: "shwetachandni502@gmail.com",
  to: "shwetachandni502@gmail.com",
  subject: "Test Email",
  text: "This is a test email",
  html: "<p>This is a test email</p>"
}).then(result => {
  console.log("Sent email");
}, err => {
  console.error(err);
});
