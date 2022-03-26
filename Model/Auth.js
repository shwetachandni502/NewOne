const mongoose = require("mongoose");

const devicesSchema = new mongoose.Schema({
  deviceType: {
    type: String,
    trim: true,
  },
  deviceId: {
    type: String,
    trim: true,
  },
  token: {
    type: String,
    trim: true,
  },
});
const authDetailsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  lastName: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  email: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: String,
  },
  companyName:{
    type: String
  },
  stripeDetails: {
    isAccountVerified: {
      type: Boolean,
      default: false
    },
    stripeMail: {
      type: String,
    },
    stripeAccountId: {
      type: String,
    }
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  password: {
    type: String,
  },

  forgotPasswordToken: {
    token: {
      type: String,
    },
    validTill: {
      type: String,
    },
  },
  image: {
    type: String,
  },
 
  age: {
    type: String,
  },
  gender: {
    type: String,
  },
  dob: {
    type: String,
  },
  country: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  state: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  city: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  pinCode: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  language: {
    type: String,
    default: "en"
  },
  description: {
    type: String,
  },
  walletAmount: {
    type: Number,
    default: 0
  },
  isUserBlocked: {
    type: Boolean,
    default: false,
  },
  coordinates: {
    lng: {
      type: Number,
      default: 0,
    },
    lat: {
      type: Number,
      default: 0,
    },
  },
  emailNotification:{
   type: Boolean,
   default:false
  },
  smsNotification:{
    type: Boolean,
    default:false
   },
  devices: devicesSchema,
  accountType: {
    type: String,
    required: true,
    trim: true,
    default: "user",
    enum: ["merchant", "user", "provider"],
  },
  qrCode: {
    type: String,
  }
});

const Auth = mongoose.model("AuthDetails", authDetailsSchema);

module.exports = Auth;
