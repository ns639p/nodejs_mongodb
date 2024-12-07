const Movie = require('./../Models/movieModel')
const ApiFeatures = require('./../utils/ApiFeatures')

exports.highestRated = (req,res,next)=>{
    req.query.limit = '5';
    req.query.sort='-ratings';
    next();
}


exports.getAllMovies = async(req,res)=>{
    try{
        const features = new ApiFeatures(Movie.find(),req.query).filter().sort().limitFields().paginate();
        const movies = await features.query
        res.status(200).json({
            status:'success',
            length:movies.length,
            data:{
                movies
            }
        })
    }catch(err){
        res.status(400).json({
            status:'failed',
            message:err.message
        })
    }
}

exports.getMovie = async(req,res)=>{
    try{
        const movie = await Movie.findById(req.params.id);
        res.status(200).json({
            status:'success',
            data:{
                movie
            }
        })
    }catch(err){
        res.status(400).json({
            status:'failed',
            message:err.message
        })
    }
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


exports.updateMovie = async(req,res)=>{
    try{
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,req.body,{runValidators:true,new:true})
        res.status(200).json({
            status:'success',
            data:{
                movie:updatedMovie
            }
        })
    }catch(err){
        res.status(404).json({
            status:'failed',
            message: err.message
        })
    }
}


exports.deleteMovie = async(req,res)=>{
    try{
        await Movie.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status:'success',
            data:null
        })
    }catch(err){
        res.status(404).json({
            status:'failed',
            message: err.message
        })
    }
}