const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");

const test = (req, res) => {
  res.json("test is working");
};

// Register Endpoint
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //Check if name was entered
    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }
    //Check if email was entered
    if (!email) {
      return res.json({
        error: "Email is required",
      });
    }
    // check is password is good
    if (!password || password.length < 6) {
      return res.json({
        error: "Password required and should be 6 characteres long",
      });
    }
    // check email
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is taken",
      });
    }

    const hashedPassword = await hashPassword(password);

    //create use in db
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

//Login Endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if email was entered
    if (!email) {
      return res.json({
        error: "Email Required",
      });
    }

    // check is password is good
    if (!password || password.length < 6) {
      return res.json({
        error: "Password required and should be 6 characteres long",
      });
    }

    //check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "User doesn't exist",
      });
    }

    //check if password matched
    const match = await comparePassword(password, user.password);
    if (match) {
      res.json("Password Matched");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  test,
  registerUser,
  loginUser,
};
