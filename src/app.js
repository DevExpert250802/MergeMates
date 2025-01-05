const express = require("express");
const connectDB = require("./config/database");
const User = require('./models/user.models');
const {validateSignUpData}  = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const {userAuth} = require("./middlewares/auth")

const app = express();
app.use(express.json());
app.use(cookieParser())


// signup API
app.post("/signup", async(req,res)=>{
    try{
    // Validation  of data

    validateSignUpData(req);

    const {username,lastname,email,password} = req.body;

    // encrypt the password

  const passwordHash = await bcrypt.hash(password, 10)

    //create a new instance of the user model
    const user = new User({
        username,
        lastname,
        email,
        password : passwordHash,
    });
 
        await user.save();
        res.status(201).send('Data of a user is saved');
    }
    catch(err){
        res.status(400).send("Error saving the data : " + err.message)
    }
}); 


// Login API
app.post("/login",async(req,res)=>{
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
            res.cookie("token",token)
            res.send("Login Successful");
        }else{
            throw new Error("Invalid Credentials");
        }
    } catch (err) {
        res.status(500).send("Error :" + err.message);
    }
});


// Get Profile
app.get("/profile",userAuth,async(req,res)=>{  
    try{  
    const user = req.user
    res.send(user)
    } catch (err) {
    res.status(500).send("Error: " + err.message);
   }
});


// send connection request
app.post("/sendingConnectionRequest",userAuth,async(req,res)=>{ 
      try{ 
        const user = req.user;
        //Sending Connection Request
        console.log("Sending Connection Request");

        //Connection Request Sent
        res.send(user.username + " Sent connection request");
      } catch (err) {
        res.status(500).send("Error: " + err.message);
       }
});








app.delete("/user",async(req,res)=> { 
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).send('User deleted successfully');
    } catch (err) {
        res.status(500).json({ error: 'Error deleting the user data', message: err.message });
    }
});


// update the  data of the user

app.patch("/user", async(req,res)=>{
    const userId = req.body.userId;  
    const data = req.body;
    try{
         const user = await User.findByIdAndUpdate(userId, data ,{
            returnDocument: "before"
        });
         console.log(user);
         res.send("user updated successfully")
        }catch(err){
         res.status(400).send("Cannot update   the  user data" + err.message)
    }
});




connectDB()
    .then(() => {
        console.log('DB connected');
        app.listen(3000, () => {
            console.log('Server is successfully listening on port 3000');
        });
    })
    .catch((err) => {
        console.error('DB cannot be connected', err);
    });
