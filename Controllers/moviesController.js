const Movie = require('./../Models/movieModel')



exports.validateBody = (req,res,next)=>{
    if (!req.body.name||!req.body.releaseYear){
        return res.status(400).json({
            status:'fail',
            message:'Not a valid movie data'
        })
    }
    next()
}


exports.getAllMovies = (req,res)=>{
}

exports.getMovie = (req,res)=>{
}


exports.createMovie = (req,res)=>{
}


exports.updateMovie = (req,res)=>{
}


exports.deleteMovie = (req,res)=>{
}