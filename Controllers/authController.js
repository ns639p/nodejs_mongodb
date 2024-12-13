const User = require('./../Models/userModel')
const asyncErrorHandler = require('./../utils/asyncErrorHandler')
const CustomError = require('./../utils/CustomError')
const jwt = require('jsonwebtoken')

const signToken = id =>{
    return jwt.sign({id},process.env.SECRET_STR,{
        expiresIn:process.env.EXPIRESIN
    })
}


exports.signup = asyncErrorHandler(async(req,res,next)=>{
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id)
    res.status(201).json({
        status:'success',
        token,
        data:{
            user:newUser
        }
    })
})


exports.login = asyncErrorHandler(async(req,res,next)=>{
    const {email,password} = req.body;
    if (!email||!password){
        const error = new CustomError('Please provide email and password for login',400);
        return next(error);
    }

    const user = await User.findOne({email}).select('+password')


    if(!user||!(await user.comparePasswordInDb(password,user.password))){
        const error = new CustomError('Incorrect Email or password',400);
        return next(error);
    }

    const token = signToken(user._id);

    res.status(201).json({
        status:'success',
        token,
        user
    })
})
