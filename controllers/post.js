const Post = require('../model/model');
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.postById = (req, res, next , id) =>{
    Post.findById(id)
    .populate("postedBy", "_id name")
    .exec( (err, post) =>{
        if (err){
            return res.status(400).json({
                error : err
            })
        }
        req.post = post
        next()
     });
}

exports.getPost = (req,res) =>{
    const posts = Post.find()
    .populate("postedBy", "_id name")
    .select("_id title body")
    .then((posts)=>{
        res.json({posts})
    })
    .catch(error =>{
        console.log(error)
    })
}

exports.createPost = (req, res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) =>{
        if (err) {
            return res.status(400).json({
                error : "Image could not be uploded"
            });
        }

        let post = new Post(fields);

        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;

        if (files.photo) {
        post.photo.data = fs.readFileSync(files.photo.path)
        post.photo.contentType = fields.photo.type
        }
        post.save((err, result) => {
            if (err){
                return res.status.json({
                    error : err
                })
            }
            res.json({result})
           })
    
        })
    // const post  = new Post(req.body);
    // post.save().then(result => {
    //         return res.status(200).json({
    //             post : result
    //         })
    // })

};

exports.postByUser  = (req, res) => {
    Post.find({postByUser : req.profile._id})
    .populate("postedBy", "_id name")
    .sort ("_created")
    .exec((err, posts)=>{
        if (err)
        {
            return res.status(400).json({
                error : err
            })
        }

        res.json(posts)

    })
}

exports.isPoster = (req, res , next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id && req.auth._id
    if (!isPoster) {
        return res.status(403).json({
            error : "User is not authorized"
        })
    }
    next();
};

exports.deletePost = (req, res, next) => {
    let post = req.post;
    post.remove((err, post) =>{
        if (err){
            return res.status(400).json({
                error : err
            })
        }
        res.json({
            message : "Post deleted Successfully"
        })
    })
     next()
}

exports.updatePost =(req, res, next) =>{
    let post = req.post
    post = _.extend(post , req.body)
    post.updated = Date.now();
    post.save(err=>{
        if (err){
            return res.status(401).json({
                error : err
            })
        }
        res.json(post)
    }) 

    
}