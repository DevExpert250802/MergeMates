const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender type",
      },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate: {
        validator: validator.isURL,
        message: "Invalid Photo URL",
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

 
userSchema.methods.getJWT = async function() {
  const user =  this;
  const token = await jwt.sign({_id : user._id }, "Dev@Tinder790",{expiresIn : "1h"});
  return token;
}


userSchema.methods.validatePassword = async function(passwordInputByUser) {
  const user = this;
  const passwordHash =user.password
  // Do not interchange parameters
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser, 
    passwordHash
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
