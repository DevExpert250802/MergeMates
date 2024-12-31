const mongoose = require("mongoose")
const userSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, // Remove whitespace
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'], // Validate email format
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'], // Enforce a minimum length
      },
    },
    {
      timestamps: true,
    }
  );
  
   const User = mongoose.model("User", userSchema);
   module.exports= User;