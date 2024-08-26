const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  //   name: {
  //     type: String,
  //     required: true,
  //   },
  //   email: {
  //     type: String,
  //     required: true,
  //     min: 4,
  //     max: 255,
  //     unique: true,
  //   },
  //   password: {
  //     type: String,
  //     required: true,
  //   },
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
