const jwt = require("jsonwebtoken")
const User = require("../models/user.models")


const userAuth = async (req, res, next) => {
    try {  
        const cookies = req.cookies;
        const { token } = cookies;

        if (!token) {
            console.log("No token found in cookies");
            throw new Error("Invalid token"); // Ensure response is sent only once
        }
        // Validate the token
        const decodedMessage =  jwt.verify(token, "Dev@Tinder790");
        const { _id } = decodedMessage;

        const user = await User.findById(_id);
        if (!user) {
            console.log("User not found for ID:", _id);
            throw new Error("User does not exist");
        }
        req.user = user;
        next(); // Proceed to the next middleware or route
    }catch (err) {
        res.status(401).send("Error: " + err.message); // Concatenation
    }       
};


module.exports = {
    
    userAuth,
};

