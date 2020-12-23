const {getPost , createPost, postByUser, postById, isPoster , deletePost, updatePost} = require("../controllers/post")
const {requiresignin} = require("../controllers/auth")
const {createPostValidator} = require('../validator/validator');
const {userById} = require('../controllers/user');
const express = require("express");

const router = express.Router();


router.get("/posts", getPost);
router.post("/post/new/:userId", requiresignin, createPost , createPostValidator );
router.get("/posts/by/:userId",requiresignin, postByUser );
router.delete("/post/:postId", requiresignin , isPoster, deletePost );
router.put("/post/:postId", requiresignin , isPoster, updatePost );
//any route that contain :userId, over app will first execute userById()
router.param("userId", userById);
//any route that contain :postId, over app will first execute postById()
router.param("postId", postById);
module.exports = router  ; 




