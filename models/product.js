const mongoose = require ("mongoose")
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema ({
    name : {
        type: String,
        required: true ,
        trim: true,
        maxlength:200
    },
    description : {
        type: String,
        required: true ,
        trim: true,
        maxlength:2000
    }, 
    location : {
        type: String,
        required: true ,
        trim: true,
        maxlength:200
    },
    userId : {
        type: String,
        required: true ,
        trim: true,
        maxlength:30
    },  
    userName : {
        type: String,
        required: true ,
        trim: true,
        maxlength:200
    }, 
    price : {
        type: Number,
        required: true ,
        trim: true,
        maxlength:32
    },    
    category : {
        type: ObjectId,
        ref : 'Category',
        required : true
    },
    photo : {
        data: Buffer,
        contentType : String
    },
    bidPrice : {
        type: Number,
        required: true ,
        trim: true,
        maxlength:32
    },
    bidUserID : {
        type: String,
        required: true ,
        trim: true,
        maxlength:200
    },
    bidUserNumber : {
        type: Number,
        required: true ,
        trim: true,
        maxlength:32
    },
    bidUserName : {
        type: String,
        required: true ,
        trim: true,
        maxlength:32
    },
    sDate : {
        type: String,
        required: true ,
        trim: true,
        maxlength:32
    },
    eDate : {
        type: String,
        required: true ,
        trim: true,
        maxlength:32
    }
}, {timestamps: true})

module.exports = mongoose.model ( "Product", productSchema)



