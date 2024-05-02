const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  DOB: {
    type: Date,
  },
  password: {
    type: String,
    required: true,
  },
  contact:{
    type: String,
    default:"",
  },
  imageUrl: { 
    type: String,
    default:""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
