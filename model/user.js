const mongoose =  require('mongoose');
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');

const userSchema = new mongoose.Schema ({
    name : {
        type : String ,
        trim : true , 
        require : true , 
    }, 
    email : {
        type : String ,
        trim : true , 
        
        require : true , 
    }, 
    hashed_password : {
        type : String ,
        require : true , 
    },
    salt : String , 
    createrDate : {
        type : Date ,
        default : Date.now(),
    }, 
    updated : Date ,
});

userSchema.virtual('password')
.set(function(password){
    //create temp password variable
    this._password = this.password;
    //generate timestamp
    this.salt = uuidv1;
    //encrypt password
    this.hashed_password = this.encryptPassword(password);
})
.get(function(){
    return this._password;
})

 //Methods
userSchema.methods = {
    //authenticate password is match or not
    authenticate : function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    } ,

    encryptPassword : function(password){
        if(!password) return "";
        try{
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex');
        }
        catch(err){
            return "" ;
        }
    }
}




module.exports = mongoose.model("User", userSchema);