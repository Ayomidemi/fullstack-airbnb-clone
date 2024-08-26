const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlaceSchema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  address: String,
  photos: [String],
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  maxGuests: Number,
});

const PlaceModel = mongoose.model("Place", PlaceSchema);

module.exports = PlaceModel;
