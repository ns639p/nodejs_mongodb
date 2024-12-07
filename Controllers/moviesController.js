const Movie = require('./../Models/movieModel')





exports.getAllMovies = async(req,res)=>{
    try{
        let queryStr = JSON.stringify(req.query);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g,(match)=>`$${match}`);
        let queryObj = JSON.parse(queryStr);
        delete queryObj.sort
        let query = Movie.find(queryObj);
        if (req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createdAt');
        }
        const movies = await query

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