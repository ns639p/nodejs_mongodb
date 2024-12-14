const CustomError = require('./../utils/CustomError')
function developmentError(res,error){
    res.status(error.statusCode).json({
        status:error.status,
        message:error.message,
        stackTrace:error.stack,
        error:error
    })
}

function productionError(res,error){
    if (error.isOperational){
        res.status(error.statusCode).json({
        status:error.status,
        message:error.message
        })
    }else{
        res.status(500).json({
            status:'error',
            message:'Something went wrong buddy boy! please try again'
            })
    }
}


function castErrorHandler (error){
    const msg = `Invalid value for ${error.path}: ${error.value}` 
    return new CustomError(msg,400);
}


function duplicateKeyErrorHandler(error){
    const name = error.keyValue.name
    const msg = `There is already a movie with the name ${name}`;
    return new CustomError(msg,400)
}


function validationErrorHandler(error){
    const errors = Object.values(error.errors).map(val=>val.message);
    const errorMessages = errors.join(', ');
    return new CustomError(errorMessages,400)
}


function expiredJWT(error){
    return new CustomError('JWT expired please login again',401)
}



function jsonWebTokenErrorHandler(error){
    return new CustomError('Invalid token. please login again',401)
}

module.exports = (error,req,res,next)=>{
    error.statusCode = error.statusCode||500;
    error.status=error.status||'error';
    if (process.env.NODE_ENV === 'development'){
        developmentError(res,error)
    }else if (process.env.NODE_ENV==='production'){
        if (error.name === 'CastError')error = castErrorHandler(error);
        if (error.code === 11000) error = duplicateKeyErrorHandler(error);
        if (error.name === 'ValidationError') error = validationErrorHandler(error);
        if (error.name === 'TokenExpiredError') error = expiredJWT(error);
        if (error.name === 'JsonWebTokenError') error =jsonWebTokenErrorHandler(error)

        productionError(res,error);
    }
}

