const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());


// Import routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");


// use router
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);  


// Connect to the database and start the server
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
