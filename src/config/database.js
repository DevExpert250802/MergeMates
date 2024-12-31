 const mongoose = require("mongoose");

 const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://NamasteNode:admin@namastenode.0fpmy.mongodb.net/MergeMates"
    );
 };
 module.exports = connectDB;

 


