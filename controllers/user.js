const User = require("../models/user");
const formidable  = require("formidable")
const fs = require("fs")
exports.userById = (req, res, next, id) => {
    User.findById(id).exec( (err , user) =>{
        if (err || !user) {
            res.status(400).json({
                err : "User Not Found!!!!"
            })
        }
            req.profile  = user ;
            next();
        
    })
}
exports.allUsers = (req, res) => {
    User.find()
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          error: "No User found",
        });
      }
      getAllUsersFromDB();
      async function getAllUsersFromDB () {
        await users.map((user)=> {
            user.photo = undefined;
            user.hashed_password = undefined;
            user.salt = undefined;
            user.history = undefined;
        })
        res.json(users);
      }
     
    });
}

exports.userProduct = (req, res, next, id) => {
    User.findById(id).exec( (err , user) =>{
        if (err || !user) {
            res.status(400).json({
                err : "User Not Found!!!!"
            })
        }
            req.profile  = user ;
            next();
        
    })
}


exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};
exports.photo = (req, res, next) => {
    if (req.profile.photo) {
        res.set('Content-Type',req.profile.photo.contentType);
        return res.send(req.profile.photo.data);
    }
    next();
};
exports.updateProfile = (req, res) => {
    console.log('req.profile._id', req.profile._id)
   
    let form = new formidable.IncomingForm();
    form.keepExtensions = true ;
    form.parse(req, (err, fields, files)=>{
        if(err){
            res.status(400).json({
                err: "Image Could not be uploaded!!!!!"
            })
        }

        if(files.photo){
            if (files.photo.size > 5000000) {
                return res.status(401).json({
                    error : "Image size sholud be less than 5Mb"
                })
            }
            const newData = {
                photo: {
                    data: fs.readFileSync(files.photo.path),
                    contentType : files.photo.type
                }
            }
            User.findOneAndUpdate({'_id' : req.profile._id }, newData, {new: true})
            .then((data) => {
               res.json(data)
            })
            .catch(err => {
               res.status(400).json({
                   error : errorHandler(err)
               })
            })
        }
        

       
        
    })
}
exports.update = (req, res) => {
    const { name, password, newPassword, confirmPassword } = req.body;

    User.findOne({ _id: req.profile._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        } else {
            user.name = name;
        }
        if (password && newPassword && confirmPassword) {
            if (user.authenticate(password)) {
                if (newPassword.length < 6 && confirmPassword.length < 6) {
                    return res.status(400).json({
                        error: 'Password should be min 6 characters long'
                    });
                }
                else if (password === newPassword) {
                    return res.status(400).json({
                        error: 'New password must be different from Old Password'
                    });
                } else {
                    user.password = newPassword;
                }
            }
            else {
                return res.status(400).json({
                    error: "Old Password Doesn't match . Please Try Again !!!"
                });
            }
            
        }
        else {
            return res.status(400).json({
                error: "All fields are required !!!"
            });
        }
        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
                });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });
};


exports.deleteUser = (req, res) => {
    const user = req.profile;
    console.log('req.user', req.profile)
    user.remove((err, deletedUser) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.status(200).json({
        message: "User Deleted Successfully!!",
      });
    });
};
  
