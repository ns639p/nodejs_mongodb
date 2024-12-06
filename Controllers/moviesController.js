const Movie = require('./../Models/movieModel')





exports.getAllMovies = (req,res)=>{
}

exports.getMovie = (req,res)=>{
}


exports.createMovie = async(req,res)=>{
    try{
        const movie = await Movie.create(req.body)
        res.status(201).json({
            status:'success',
            data:{
                movie:movie
            }
        })
    }catch(err){
        res.status(400).json({
            status:'failed',
            message: err.message
        })
    }
}


exports.updateMovie = (req,res)=>{
}


exports.deleteMovie = (req,res)=>{
}