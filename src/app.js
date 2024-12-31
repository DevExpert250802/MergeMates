const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user.models');

const app = express();
app.use(express.json());

app.post("/signup", async(req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.status(201).send('Data of a user is saved');
    }catch(err){
        res.status(400).send("Error saving the data" + err.message)
    }
});

// Get user by email
app.get("/user", async(req,res)=>{
     const userEmail = req.body.email;
     if (!userEmail || userEmail.trim() === "") {
        return res.status(400).json({ error: 'Email query parameter is required.'});
    }
      try{
        const user = await User.find({email:userEmail});
        if (user.length===0) {
            return res.status(404).send("User not found");
        }else{
            res.send(user);
        }
      }
      catch(err){
        res.status(400).send("Error finding the  user data" + err.message)
    }
});


// Feed API - Get /feed - get  all the users from the database
app.get("/feed", async(req,res)=>{
          
         try{
           const user = await User.find({});
           res.send(user);
         }catch(err){
           res.status(400).send("Error finding the  user data" + err.message)
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
