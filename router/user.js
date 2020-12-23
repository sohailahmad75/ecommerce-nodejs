const express = require ("express")
const router = express.Router()

const {requireSignIn ,isAuth , isAdmin} = require("../controllers/auth")
const {
    userById , userProduct, read, update , updateProfile, photo, allUsers, deleteUser
} = require("../controllers/user")

router.get("/secret/:userId" , requireSignIn , isAuth , isAdmin , (req ,res) =>{
    res.json({
        user: req.profile
    });
});
router.get("/userInfo/:userId" , (req ,res) =>{
    console.log('req.profile',req.profile)
    req.profile.hashed_password= undefined;
    req.profile.salt= undefined;
    req.profile.role= undefined;
    res.json({
        user: req.profile
    });
});
router.get('/user/:userId', requireSignIn, isAuth, read);
router.put('/user/:userId', requireSignIn, isAuth, update);
router.put('/user/profile/:userId', requireSignIn, isAuth, updateProfile);
router.get("/user/photo/:userId", photo);
router.param("userId", userProduct)
router.param("userId", userById)
router.get('/allusers', allUsers);
router.delete('/delete/:userId', deleteUser);
module.exports = router ;