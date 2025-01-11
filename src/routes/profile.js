const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const validator = require("validator");


// Get Profile
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});


// Edit Profile
profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.username}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});


// Change Password 
profileRouter.patch("/changePassword", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;

    // Validate inputs
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required." });
    }

    // Validate old password
    const isOldPasswordValid = await loggedInUser.validatePassword(oldPassword);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    // Validate new password strength
    if (!validator.isStrongPassword(newPassword, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })) {
      return res.status(400).json({
        message: "New password must be at least 8 characters long and include an uppercase letter, a number, and a lowercase letter.",
      });
    }

    // Hash and update new password
    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.username}, your password was updated successfully.`,
    });
  } catch (err) {
    res.status(500).json({ message: "An error occurred while changing the password.", error: err.message });
  }
});


module.exports = profileRouter;