const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express(); 
require('dotenv').config()


// Middleware
//cors middleware to allow other IP address and setting thedomains which we want to allow
app.use(cors({
     origin: "http://localhost:5173",
     credentials: true,                  // Required to allow sending cookies
    }));

//built-in middleware to convert json to js obj
app.use(express.json());

//built-in middleware to parse cookies
app.use(cookieParser());



// Import routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");



// use router
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);  






// Connect to the database and start the server
connectDB()
    .then(() => {
        console.log('DB connected');
        app.listen(process.env.PORT, () => {
            console.log('Server is successfully listening on port 4000');
        });
    })
    .catch((err) => {
        console.error('DB cannot be connected', err);
    });
