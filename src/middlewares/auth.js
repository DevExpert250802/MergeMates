const jwt = require("jsonwebtoken")
const User = require("../models/user.models")


const userAuth = async (req, res, next) => {
    try {  
        const cookies = req.cookies;
        const { token } = cookies;

        if (!token) {
            return res.status(401).send("Please Login!")
        }
        // Validate the token
        const decodedMessage =  jwt.verify(token, "Dev@Tinder790");
        const { _id } = decodedMessage;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User does not exist");
        }
        req.user = user;
        next(); // Proceed to the next middleware or route
    }catch (err) {
        res.status(400).send("Error: " + err.message); // Concatenation
    }       
};


module.exports = {
    
    userAuth,
};

