const express = require("express");
const authRouter = express.Router();
const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");


// signup API
authRouter.post("/signup", async (req, res) => {
    try{
    // Validation  of data

    validateSignUpData(req);

    const {username,lastName,email,password,age,gender,about,skills} = req.body;

    // encrypt the password

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }


  const passwordHash = await bcrypt.hash(password, 10)

    //create a new instance of the user model
    const user = new User({
        username,
        lastName,
        email,
        password : passwordHash,
        age,
        gender,
        about,
        skills
    });
 
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(400).send("ERROR : " + err.message);
  }
});


// Login API
authRouter.post("/login", async (req, res) => {
    try{
        const {email , password} = req.body;

        const user = await User.findOne({email:email});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isValidPassword = await user.validatePassword(password);

        if (isValidPassword) {
            // Create a JWT Token
            const token = await user.getJWT(); 
            // Add the Token to cookie and send the response to the user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
              });
              res.send(user);
            } else {
              throw new Error("Invalid credentials");
            }
          } catch (err) {
            res.status(400).send("ERROR : " + err.message);
          }
        });
   
// Logout API
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});


module.exports = authRouter;