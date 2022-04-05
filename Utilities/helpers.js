
const codeGenerator = require("generate-otp");
const fast2sms = require("fast-two-sms");
const {FAST2SMS} = require("../Config/config");

exports.otpGenerator = (code_length) => {
  return codeGenerator.generate(code_length, {
    numbers: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
};

exports.fast2sms = async ({ message, contactNumber }, next) => {
  try {
    console.log("call")
    const res = await fast2sms.sendMessage({
      authorization: FAST2SMS,
      message,
      numbers: [contactNumber],
    });
    console.log("res------", res)
   next
  } catch (error) {
    next(error);
  }
};