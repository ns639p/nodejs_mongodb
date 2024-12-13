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
    password:{
        type:String,
        required:[true,'Pkease enter an password'],
        minlength:8
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

    }
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword=undefined;
    next();
})

const User = mongoose.model('User',userSchema)


module.exports = User