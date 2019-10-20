const User = require('../model/user');
const _ = require("lodash");

exports.userById = (req, res, next , id) => {
    User.findById(id).exec((err, user)=>{
        if(err || !user){
            res.status(403).json({
                error : "User Not found"
            })
        }
        req.profile = user //add profile method in request object with user info
        next();
    })
}

exports.hasAuthorization = (req, res, next) => {

    const authorization = req.profile && req.auth && req.profile._id === req.auth._id 
    if (!authorization){
        return  res.status(401).json({
            error : "User is not Authorized to perform this action"
        })
    }
    
    next();

}

exports.allUser = (req, res) => {
    User.find((err, user) =>{
        if (err || !user){
            res.status(401).json({
                error : err
            })
        }
        res.json({user})
    }).select("name email updated createrDate")

}

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt =undefined;
    return res.json(req.profile)
}

exports.userUpdate =(req, res, next) =>{
    let user = req.profile;
    user = _.extend(user, req.body) //mutate the source object
    user.updated = Date.now();
    user.save((err) =>{
        if (err)
        {
            return res.status(400).json({
                error : " You are not authorized to perform this action"
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({user})
    })
}

exports.userDelete = (req, res , next) => {
    let user = req.profile;
    user.remove ((err, user) => {
        if(err)
        {
            return res.status(400).json({
                error : err
            })
        }

        res.json({
            message : "User removed Successfully"
        })
    })
}