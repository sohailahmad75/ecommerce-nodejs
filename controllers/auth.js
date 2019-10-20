const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJWT = require("express-jwt");

const User = require("../model/user");

exports.signup = async (req, res) => {
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    return res.status(403).json({
      error: "Email is taken"
    });
  }
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({
    message: "Sign Up successfully !!!! Please Login"
  });
};

exports.signin = (req, res) => {
  // find the user based on id
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    // if error or no user
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email do not exist ! Please SignUp"
      });
    }
    // if user is found make sure that the email and password is match
    // create authenticate method and user here
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match"
      });
    }
    //generate token using userid and env secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //persist the token as 't' in cooki with expiry date

    res.cookie("t", token, { expire: new Date() + 9999 });
    // return respose with user to front end client
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({
    message: "Logout Successfully!!!!!!!!!!"
  });
};

exports.requiresignin = expressJWT({
  //If the token is valid, exprss fwt appends the verified user id
  //in the auth key to req object
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});
