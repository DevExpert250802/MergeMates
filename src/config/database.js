 const mongoose = require("mongoose");

 const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://NamasteNode:302020DkPs@namastenode.0fpmy.mongodb.net/MergeMates"
    );
 };
 module.exports = connectDB;

 


