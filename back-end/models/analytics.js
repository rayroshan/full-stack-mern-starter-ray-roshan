const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  city: { type: String, required: false },
  country: { type: String, required: false },
  hostname: { type: String, required: false },
  ip: { type: String, required: false },
  postal: { type: String, required: false },
  region: { type: String, required: false },
  timestamp: { type: Date, default: Date.now },
  timezone: { type: String, required: false },
  userId: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
