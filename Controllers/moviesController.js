const Movie = require('./../Models/movieModel')





exports.getAllMovies = async(req,res)=>{
    try{
        let queryStr = JSON.stringify(req.query);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g,(match)=>`$${match}`);
        let queryObj = JSON.parse(queryStr);
        delete queryObj.sort
        delete queryObj.fields
        delete queryObj.limit
        delete queryObj.page
        let query = Movie.find(queryObj);
        if (req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createdAt');
        }
        if (req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query=query.select(fields) 
        }else{
            query=query.select('-__v');
        }

        const page = req.query.page*1||10;
        const limit = req.query.limit*1||10;
        const skip = (page-1)*limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page){
            const moviesCount = await Movie.countDocuments()
            if (skip>=moviesCount){
                throw new Error('This page is not found')
            }
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