const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/userModel");

const router = express.Router();

//function to check if a string is a valid email address
const isEmail =   email => {
  if (typeof email !== "string") {
    return false;
  }
  const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  return emailRegex.test(email);
};



//signUp route
router
.post("/register", async (req, res) => {
  try {
    const {name, email, password } = req.body;

    if(typeof name !== "string" )
    throw new Error("Name must be a string.");

    if (!isEmail(email)) {
      throw new Error("Email must be a valid email address.");
    }
    if (typeof password !== "string") {
      throw new Error("Password must be a string.");
    }


    //create a new user
    const user = new User({name, email, password });
    const savedUser = await user.save();

    res.status(201).json({
      title: "User Registration Successful",
      detail: "Successfully registered new user"
    });
  } catch (err) {
    res.status(400).json({
      errors: 
        {
          title: "Registration Error",
          detail: "Something went wrong during registration process.",
          errorMessage: err.message
        }
    });
  }
});


//signIn route
router.post("/login", async (req, res) => {
  try {
    const {name, email, password } = req.body;

    if (!isEmail(email)) {
      return res.status(400).json({
        errors: [
          {
            title: "Bad Request",
            detail: "Email must be a valid email address"
          }
        ]
      });
    }
    if (typeof password !== "string") {
      return res.status(400).json({
        errors: [
          {
            title: "Bad Request",
            detail: "Password must be a string"
          }
        ]
      });
    }



    //querying the database to find a user with the received email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found!');
    }

    //using bcrypt to compare passwords
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      throw new Error();
    }

    res.json({
      title: "Login Successful",
      detail: "Successfully validated user credentials"
    });
  } catch (err) {
    res.status(401).json({
      errors:         {
          title: "Invalid Credentials",
          detail: "Check email and password combination",
          errorMessage: err.message
        }
      
    });
  }
});

module.exports = router;
