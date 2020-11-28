const User = require("../models/user");
const expressjwt = require("express-jwt"); //use for authorization check
const jwt = require ("jsonwebtoken") //generate signin webtoken
const {errorHandler} = require("../helper/dbErrorHandler")

exports.signUp = (req, res) => {
    console.log('req.body',req.body)
    const user = new User(req.body);
    user.save((err, result) =>{
        if (err) {
            return res.status(400).json({
                 err : errorHandler (err)
                
            })
        }
        user.salt = undefined ;
        user.hashed_password = undefined;
        return res.status(200).json({
            user : result
        })
    })   
}

exports.signIn = (req, res) => {
    const {email , password} = req.body;
    // findONe(queryParameter, projection)
    User.findOne({email}, (err,user) => {
        if (err || !user) {
            return res.status(400).json({
                err : "User With this email Doesn't Exist !! Please SignUp" 
            })
        }

        // User is found now match the email and passoword
        if (!user.authenticate(password)) {
            return res.status(400).json({
                err: "Email and password Doesn't match . Please Try Again !!!"
            })
        }
        // Generate token with user id and jwt secret 
        const token = jwt.sign({id : user._id} , process.env.JWT_SECRET)  
        res.cookie('t' , token ,  {expire : new Date()+ 9999})
        const {_id, name , email , role, number} = user;
        // return to frontENd user
        return res.status(200).json({token , user : {_id, name , email , role, number}})

    })
}
exports.signOut = (req, res) => {
    res.clearCookie('t')
    return res.json({
        message : "User SignOut Successfully!!"
    })
}

exports.requireSignIn = expressjwt({
    secret : process.env.JWT_SECRET,
    userProperty : "auth"
})

exports.isAuth = (req, res, next) => {     
    
    let user = req.profile && req.auth && req.profile._id == req.auth.id ; 
    if (!user) {
        res.status(403).json({
            err : "Access Denied"
        })
    }
    next();

}

exports.isAdmin = (req, res , next) => {
    console.log('req.profile', req.profile)
    if (req.profile.role === 0) {
        res.status(403).json({
            err : "Access Denied !!! Admin Resourse"
        })
    }
    next();
}