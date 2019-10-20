const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    title :{
        type  : String,
        required : "Title is required",
        minlength : 1,
        maxlength : 10 ,
    },
    body :{
        type  : String,
        required : "Body is required",
        minlength : 1,
        maxlength : 100 ,
    },
    photo: {
        data : Buffer,
        conteType : String
    },
    postedBy : {
        type : ObjectId,
        ref : "User"
    },
    created : {
        type : Date,
        default : Date.now()
    }

});

module.exports = mongoose.model("Post", PostSchema);