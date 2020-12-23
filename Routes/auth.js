const {signup, signin, signout} = require("../controllers/auth")
const {userSignupValidator} = require('../validator/validator');
const {userById} = require('../controllers/user');
const express = require("express");

const router = express.Router();

router.post("/signup",userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

//any route that contain :userId, over app will first execute userById()
router.param("userId" ,userById);

module.exports = router  ; 