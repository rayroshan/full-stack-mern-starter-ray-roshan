const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  active: { type: Boolean, required: false, default: true },
  affiliate: { type: Boolean, required: false, default: false },
  city: { type: String, required: false },
  cityId: { type: String, required: false },
  dateTermsAccepted: { type: Date, required: false },
  email: { type: String, required: true, unique: true },
  emailToken: { type: String, required: false },
  emailVerified: { type: Boolean, required: false, default: false },
  firstname: { type: String, required: true },
  image: { type: String, required: false },
  initialized: { type: Boolean, required: true, default: false },
  lastLoginIp: { type: String, required: false },
  lastPasswordReset: { type: Date, required: false },
  lastlogin: { type: Date, default: Date.now },
  lastname: { type: String, required: true },
  notification: { type: String, required: false },
  password: { type: String, required: true, minlength: 8 },
  passwordToken: { type: String, required: false },
  passwordTokenUsed: { type: Boolean, default: false },
  phone: { type: String, required: false },
  phoneVerified: { type: Boolean, required: false, default: false },
  platform: { type: String, required: false },
  receiveNotifications: { type: Boolean, required: false, default: true },
  receivePromotions: { type: Boolean, required: false, default: true },
  referral: { type: String, required: false },
  referrer: { type: String, required: false },
  role: { type: String, required: false },
  signedup: { type: Date, default: Date.now },
  signupCity: { type: String, required: false },
  signupCountry: { type: String, required: false },
  signupIp: { type: String, required: false },
  slug: { type: String, required: false },
  source: { type: String, required: false },
  state: { type: String, required: false },
  stateId: { type: mongoose.Types.ObjectId, required: false, ref: "State" },
  termsAccepted: { type: Boolean, required: true, default: false },
  verified: { type: Boolean, required: false, default: false },
  website: { type: String, required: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
