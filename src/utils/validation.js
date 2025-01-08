const validator = require("validator");


// Validate SignUp Data
const validateSignUpData = (req) => {
  const { username, lastName, email, password} = req.body;
  // const { username, lastName, email, password, age, gender, about, skills } = req.body;

  if (!username || !lastName) {
    throw new Error("Name is not valid!!!");
  }

  else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid!");
  }

  else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};


// Validate Edit  Profile  Data
const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "username",
    "lastName",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

// Exports
module.exports = {
  validateSignUpData,
  validateEditProfileData,
};   