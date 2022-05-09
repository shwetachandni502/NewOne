const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchant",
  },
  contactInfo: {
    name: { type: String },
    phoneNumber: { type: Number }
  },
  about: {
    type: String,
  },
  parkingImage: {
    type: String
  },
  address: {
   city: String,
   state: String,
   zipCode: String,
  },
  price: {
    type: Number,
  },
  parkingName: {
    type: String,
  },

  availability: [{
    date: {
      type: String,
    },
    day: {
      type: String,
    },

    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    }

  }],
  parkingType: {
    type: String,
    default: "residence",
    enum: ["residence", "parkinglot", "garage"],
  },
  parkingZone: [
    {
      zoneName: String,
      zoneInfo: {
        type: [{}],
        default: [
          {
            zoneNumber: 0,
            isAvailable: true,
          }]
      }
    }
  ],

  specialEvents: [{
    date: {
      type: String,
    },
    timing: [
      {
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        }
      }
    ]
  }],
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
  status: {
    type: String,
    default: "active",
    enum: ["active", "Inactive"],
  },
  isFeePaid: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

const Parking = mongoose.model("Parking", parkingSchema);
module.exports = Parking;
