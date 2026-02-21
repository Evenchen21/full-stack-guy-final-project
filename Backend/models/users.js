// models/users.js
const mongoose = require("mongoose");

//User Schema
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 2, maxlength: 20 },
  lastName: { type: String, required: true, minlength: 2, maxlength: 20 },
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    unique: true,
  },
  password: { type: String, required: true, minlength: 6, maxlength: 1024 },
  isAdmin: { type: Boolean, default: false },
  isLoggedIn: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
});

//User Model
const UserModel = mongoose.model("users", UserSchema);
//Export the User Model
module.exports = UserModel;
