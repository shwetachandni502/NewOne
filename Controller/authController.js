const Auth = require('../Model/Auth');
const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
const Validator = require('../Utilities/validator');
const {otpGenerator, fast2sms} = require("../Utilities/helpers");
const Merchant = require('../Model/Merchant');
const keys = require("../Config/config");
const qrcode = require("qrcode");
const sendMail = require("../Common/sendEmail")
const moment = require("moment")

exports.inValid = async (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Invalid Path'
    })
}
exports.login = async (req, res) => {
  try {
    const {
      email,
      password,
      lat,
      lng,
      deviceId,
      deviceType,
      deviceToken,
      phoneNumber
    } = req.body;
    console.log(email, phoneNumber)
    if(!email && !phoneNumber) {
      return res
        .status(404)
        .json({ error: "Email or Phone Number is required" });
    }
    let user;
    if(email) {
        user = await Auth.findOne({
        email
       });
      }
       if(phoneNumber) {
        user = await Auth.findOne({
        phoneNumber
       });
      }
    if(!user) return res.status(404).json({ error: "Email or Phone not found" });
      
    const verifyPassword = passwordHash.verify(
      password,
      user.password
    ); 
    if(!verifyPassword)
      return res.status(403).json({ error: "Invalid Password" });
      if(!user.isPhoneVerified)
      return res.status(403).json({ error: "Your Phone is not verified yet" });
      if(!user.isEmailVerified)
      return res.status(403).json({ error: "Your Email is not verified yet" });

    const payload = {
      id: user._id,
      name: `${user.firstName}`,
      email: user.email ? user.email : "",
    
    };

    let jwtoken = jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 });
//  let incomplete_profile = checkProfileCompleted(user.basicInfo);
    // if ( !user.image) {
    //   return res.status(400).json({ error: "Please complete your profile", token: jwtoken });
    // }
    // if(!user.isApproved) {
    //   return res
    //     .status(400)
    //     .json({ error: "Sorry, Your account is not approved yet.", token: jwtoken });
    // } 
    user.coordinates = {
      lng,
      lat,
    };

    user.devices = {
      deviceId,
      deviceType,
      token: deviceToken,
    };
    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Logged In",
      data: { token: jwtoken, user },
    });
  } catch (error) {
    return error.message
  }
};
exports.data = async(req,res) => {
  console.log("Working")
  res.send({
    success: true,
   
  });
}
exports.signup = async (req, res, next) => {
  try {
    console.log("call signup")
    const ootp = otpGenerator(4);
    console.log("oyp", ootp)
    // check existing email
    const {phoneNumber, password, accountType } = req.body;
    let check_user = await Auth.findOne({phoneNumber});
    if (check_user)
      return res.status(409).json({ error: "Phone number is already registered" });
 
    const hashedPassword = passwordHash.generate(password);
     const otp = otpGenerator(4);
     console.log("oyp", otp)
    await fast2sms(
      {
        message: `Your OTP is ${otp}`,
        contactNumber: phoneNumber,
      },
      next
    );
    // For Deployment
  const qrData = { phoneNumber};
  let strData = JSON.stringify(qrData);
   const generateQR = await qrcode.toDataURL(strData)
 console.log("generateQR", generateQR)
     let new_user = new Auth({
        phoneNumber,
        password: hashedPassword,
        accountType,
        otp,
        qrCode:generateQR,
     });

    const payload = {
      id: new_user._id,
      phoneNumber: `${new_user.phoneNumber}`,
    };
    let token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 });
    const save = await new_user.save();
    
  
    // For development & testing
  // qrcode.toString(strData, {type:'terminal'},
  //                     function (err, code) {
     
  //     if(err) return err.message;
     
  // });
  
     res.send({
      success: true,
      msg: "Details saved",
      data: { user: save, token },
    });

  
  } catch (error) {
   
    return error.message;
  }
  };

  exports.phoneOtpVerification = async (req, res, next) => {
    try {
      const isUser = await Auth
        .findById({_id: req.body.userId})
        .exec();
  
      if (!isUser) {
        return next(new Error("user does not exist"));
      }
     
      if (isUser.otp == req.body.otp) {
        isUser.isPhoneVerified = true;
        await isUser.save();
  
        var userdata = await Auth
          .findOne({ _id: isUser._id })
          .select("-password -devices -otp")
          .exec();
        return res.status(200).json({
          success: true,
          data: userdata,
          msg: "You are now a verified user",
        });
      } else {
        return res
        .status(404)
        .json({ error: "OTP not matched..Please enter valid otp" });
      }
    } catch (error) {
      return next(error);
    }
  };
  
  exports.emailOtpVerification = async (req, res, next) => {
    try {
      console.log("cal email otp")
      const isUser = await Auth
        .findById({_id: req.body.userId})
        .exec();
  
      if (!isUser) {
        return next(new Error("user does not exist"));
      }
     
      if (isUser.otp == req.body.otp) {
        isUser.isEmailVerified = true;
        await isUser.save();
  
        const userdata = await Auth
          .findOne({ _id: isUser._id })
          .exec();
          const payload = {
            id: isUser._id,
            name: `${isUser.firstName}`,
            email: isUser.email ? isUser.email : "",
          
          };
      
          let jwtoken = jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 });
        return res.status(200).json({
          success: true,
          data: {user:userdata, token: jwtoken},
          msg: "Email has been verified successfully",
        });
      } else {
        return res
        .status(404)
        .json({ error: "OTP not matched..Please enter valid otp" });
      }
    } catch (error) {
      return next(error);
    }
  };
  
  exports.resendPhoneOTP = async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const user = await Auth.findOne({ phoneNumber });
      if (!user) return res.status(404).json({ error: "User not found" });
      const otp = otpGenerator(4);
      user.otp = otp;
      await user.save();
    //  sent OTP
    await fast2sms(
      {
        message: `Your OTP is ${otp}`,
        contactNumber: phoneNumber,
      },
      next
    );
      return res
        .status(200)
        .json({ success: true, msg: "OTP sent"});
    } catch (error) {
    }
  };

  exports.resendEmailOTP = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Auth.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });
      const otp = otpGenerator(4);
      user.otp = otp;
      await user.save();
    //  sent OTP
     const subject = "Email Authentication";
    const text =  "Your otp is "+ otp;
     const isSent = await sendMail(email, subject, text);
      return res
        .status(200)
        .json({ success: true, msg: "OTP sent"});
    } catch (error) {
    }
  };


  exports.socialLogin = async (req, res) => {
    try {
      let { type, socialId, lat, lng, deviceId, deviceType, token } = req.body;
  
      if (type === "facebook") {
        var user = await Auth.findOne({
          "socialId.facebook": socialId,
        }).exec();
        if (!user) {
          return res.status(404).json({ error: "User id not found" });
        }
      }
  
      if (type === "google") {
        var user = await Auth.findOne({
          "socialId.google": socialId,
        }).exec();
        if (!user) {
          return res.status(404).json({ error: "User id not found" });
        }
      }
  
      const payload = {
        id: user._id,
        firstName: `${user.firstName}`,
      };
  
      let jwtoken = jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 });
  
      user.coordinates = {
        lat,
        lng,
      };
  
      user.devices = {
        deviceId,
        deviceType,
        token,
      };
  
      await user.save();
  
      return res
        .status(200)
        .json({ success: true, data: { user, token: jwtoken } });
    } catch (error) {
    }
  };
  

  exports.profileSetup = async (req, res) => {
    try {
      const { firstName,lastName,email,country, state, zipcode, userId } = req.body;
      const User = await Auth.findOne({_id: userId});
      const otp = otpGenerator(4);
      User.firstName = firstName;
      User.lastName = lastName;
      User.email = email;
      User.country = country;
      User.state = state;
      User.zipcode = zipcode;
      User.otp = otp;
   
    const subject = "Email Authentication";
    const text =  "Your otp is "+ otp;
     const isSent = await sendMail(email, subject, text);
    //  if(isSent){
      const save = await User.save();
      return res.status(200).json({
        success: true,
        msg: "Your Profile hasbeen updated successfully",
        data: { User: save },
      });
    //  }
      return res.status(200).json({
        success: false,
        msg: "Sorry! Your mail is not verified",   
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
  exports.updateProfile = async (req, res) => {
    try {
      const { firstName,lastName,email,country, state, zipcode } = req.body;
      const User = await Auth.findOne({_id: req.data.id});
      User.firstName = firstName;
      User.lastName = lastName;
      User.email = email;
      User.country = country;
      User.state = state;
      User.zipcode = zipcode;
    //   walker.basicInfo.image = req.files && req.files.image && keys.apiURL + req.files.image[0].filename || keys.apiURL + "default.png",
    //   walker.basicInfo.photoId = req.files && req.files.photoId && keys.apiURL + req.files.photoId[0].filename || keys.apiURL + "default.png";
    //   walker.basicInfo.insuranceProof = req.files && req.files.insuranceProof&& keys.apiURL + req.files.insuranceProof[0].filename || keys.apiURL + "default.png";
    const otp = otpGenerator(4);
    const subject = "Email Authentication";
    const text =  "Your otp is "+ otp;
     const isSent = await sendMail(email, subject, text);
     if(isSent){
      const save = await User.save();
      return res.status(200).json({
        success: true,
        msg: "Your Profile hasbeen updated successfully",
        data: { User: save },
      });
     }
      return res.status(200).json({
        success: false,
        msg: "Sorry! Your mail is not verified",   
      });
    
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
  exports.getProfile = async (req, res) => {
    try {
      let userProfile;
      const user = await Auth.findById(req.data.id);
      if (!user) return res.status(404).json({ error: "User not found" });
     
      return res.status(200).json({ success: true, data: { user } });
    } catch (error) {
    }
  };

  exports.forgotPassword = async (req, res, next) => {
    try {
      const { phoneNumber } = req.body;
      const user = await Auth.findOne({ phoneNumber });
      if (!user) return res.status(404).json({ error: "User not found" });
      const otp = otpGenerator(4);
      user.forgotPasswordToken = {
        token: otp,
        validTill: moment().add(2, "hours"),
      };
  
      const sendSms =  await fast2sms(
        {
          message: `Your OTP is ${otp}`,
          contactNumber: phoneNumber,
        },
        next
      );
      const updateUser = await user.save();
      res.send({
       success: true,
       msg: "OTP has been sent on your phone",
     });
   
    } catch (error) {
      console.log("ererrr", error)
      res.status(500).json({error: 'Internal server error'})
    }
  };
  
  exports.resetPassword = async (req, res) => {
    try {
      const {  otp, new_password } = req.body;
      const user = await Auth.findOne({_id: req.data.id});
      if (!user) return res.status(404).json({ error: "User not found" });
  
      if (user.forgotPasswordToken && user.forgotPasswordToken.token) {
        if (user.forgotPasswordToken.token !== otp) {
          return res.status(400).json({ error: "Incorrect OTP" });
        }
        if (moment().isAfter(user.forgotPasswordToken.validTill)) {
          return res
            .status(401)
            .json({ error: "OTP expired. Please generate a new one." });
        }
      } else {
        return res
          .status(404)
          .json({ error: "Token not found. You cannot change your password" });
      }
      const hashedPassword = passwordHash.generate(new_password);
      user.password = hashedPassword;
      await user.save();
      return res
        .status(200)
        .json({ success: true, msg: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({error: 'Something went wrong'});
    }
  };
  
  
