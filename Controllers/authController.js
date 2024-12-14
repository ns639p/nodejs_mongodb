const User = require('./../Models/userModel')
const asyncErrorHandler = require('./../utils/asyncErrorHandler')
const CustomError = require('./../utils/CustomError')
const jwt = require('jsonwebtoken')
const util = require('util')

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




exports.protect = asyncErrorHandler(async(req,res,next)=>{
    const testToken = req.headers.authorization;
    let token;
    if (testToken && testToken.startsWith('Bearer')){
        token = testToken.split(' ')[1]
    }

    if(!token){
        next(new CustomError('You are not logged in',401))
    }

    const decodedToken = await util.promisify(jwt.verify)(token,process.env.SECRET_STR)
    console.log(decodedToken)

    const user = await User.findById(decodedToken.id)
    if(!user){
        const error = new CustomError('User with the given token does not exist',401);
        next (error);
    }


    const isChanged = await user.isPasswordChanged(decodedToken.iat)
    if(isChanged){
        const error = new CustomError('Password has been changed recently, Please login again',401);
        next(error)
    }


    req.user=user;
    next()
})



exports.restrict = (role)=>{
    return (req,res,next)=>{
        if(req.user.role!==role){
            const error = new CustomError('You do not have permission to perform this action',403);
            next(error);
        }
        next();
    }
}