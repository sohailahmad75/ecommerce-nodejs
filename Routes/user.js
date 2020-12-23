const {userById, allUser , getUser , userUpdate , userDelete} = require('../controllers/user');
const {requiresignin} = require("../controllers/auth");
const express = require("express");

const router = express.Router();

router.get("/users", allUser);
router.get("/user/:userId",requiresignin , getUser);
router.put("/user/:userId",requiresignin , userUpdate);
router.delete("/user/:userId",requiresignin , userDelete);
//any route that contain :userId, over app will first execute userById()
router.param("userId", userById);

module.exports = router  ; 