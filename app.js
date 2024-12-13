const express = require('express');
const morgan = require('morgan')//this is a HTTP logging middleware
const globalErrorHandler = require('./Controllers/errorController')
const app = express()
const moviesRouter = require('./Routes/moviesRoutes');
const authRouter = require('./Routes/authRoutes')
const CustomError = require('./utils/CustomError')
const logger = function(req,res,next){
    console.log('custom middleware called');
    next()
}

app.use(express.json())
if (process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'))//morgan is not a middle ware this is a function that returns a middle ware. Search 'morgan github' in google and open the index.js file in line 59 you will see the morgan functon taking in only two parameters but it returns a middleware function called logger (line 103) that takes three parameters req,res and next;
}
app.use(express.static('./public'))
app.use(logger)//the above two have () but this doesnt why ? because this is a middleware function and takes three parameters req,res,next
app.use((req,res,next)=>{
    req.requestedAt = new Date().toISOString();
    next();
})


app.use('/api/v1/movies',moviesRouter);


app.use('/api/v1/users',authRouter)


app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:'failed',
    //     message:`Can't find ${req.originalUrl} on the server`
    // })
    // const err = new Error(`Can't find ${req.originalUrl} on the server`)
    // err.status='Fail';
    // err.statusCode = 404;
    const err = new CustomError(`Can't find ${req.originalUrl} on the server`,404)
    next(err);
})

app.use(globalErrorHandler)

module.exports = app;