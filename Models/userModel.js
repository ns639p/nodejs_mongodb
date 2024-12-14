const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is a required field']
    },
    email:{
        type:String,
        required:[true,'Please enter an email buddy boy'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please enter an valid email']
    },
    photo:String,
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    password:{
        type:String,
        required:[true,'Pkease enter an password'],
        minlength:8,
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            validator:function(val){
                return val==this.password
            },
            message:'Password and Confirm Password does not match'
        }
    },
    passwordChangedAt:Date
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword=undefined;
    next();
})

userSchema.methods.comparePasswordInDb = async function(pass,passDb){
    return await bcrypt.compare(pass,passDb)
}


userSchema.methods.isPasswordChanged = async function (JWTtimestamp){
    if(this.passwordChangedAt){
        const pswdChangedAtTimestamp = parseInt(this.passwordChangedAt.getTime()/1000);
        return JWTtimestamp<pswdChangedAtTimestamp
    }
    return false
}

const User = mongoose.model('User',userSchema)


module.exports = User