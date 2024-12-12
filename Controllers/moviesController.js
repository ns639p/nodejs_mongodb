const Movie = require('./../Models/movieModel')
const ApiFeatures = require('./../utils/ApiFeatures')
const asyncErrorHandler = require('./../utils/asyncErrorHandler')
exports.highestRated = (req,res,next)=>{
    req.query.limit = '5';
    req.query.sort='-ratings';
    next();
}


exports.getAllMovies = asyncErrorHandler(async(req,res,next)=>{
        const features = new ApiFeatures(Movie.find(),req.query).filter().sort().limitFields().paginate();
        const movies = await features.query
        res.status(200).json({
            status:'success',
            length:movies.length,
            data:{
                movies
            }
        })
})

exports.getMovie = asyncErrorHandler(async(req,res,next)=>{
        const movie = await Movie.findById(req.params.id);
        res.status(200).json({
            status:'success',
            data:{
                movie
            }
        })
})


exports.createMovie = asyncErrorHandler(async(req,res,next)=>{
        const movie = await Movie.create(req.body)
        res.status(201).json({
            status:'success',
            data:{
                movie:movie
            }
        })
})


exports.updateMovie = asyncErrorHandler(async(req,res,next)=>{
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,req.body,{runValidators:true,new:true})
        res.status(200).json({
            status:'success',
            data:{
                movie:updatedMovie
            }
        })
})


exports.deleteMovie = asyncErrorHandler(async(req,res,next)=>{
        await Movie.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status:'success',
            data:null
        })
})


exports.getMovieStats = asyncErrorHandler(async(req,res,next)=>{
        const stats = await Movie.aggregate([{
            $match:{ratings:{$gte:4.5}}
        },{
            $group:{
                _id:'$releaseYear',
                avgprice:{ $avg:'$price'},
                avgRatings:{$avg:'$ratings'},
                maxPrice:{$max:'$price'},
                minPrice:{$min:'$price'},
                priceTotal:{$sum:'$price'},
                movieCount:{$sum:1}
               } 
        },{
            $sort:{minPrice:1}
        }])

        res.status(200).json({
            status:'success',
            count:stats.length,
            data:{
                stats
            }
        })
})


exports.getMoviesByGenre = asyncErrorHandler(async(req,res,next)=>{
        const genre = req.params.genre;
        const movies = await Movie.aggregate([{
            $unwind:"$genres"
        },{
            $group:{
                _id:'$genres',
                movieCount:{$sum:1},
                movies:{$push:"$name"}
            }
        },{
            $addFields:{genre:"$_id"}
        },{
            $project:{_id:0}
        },{
            $sort:{movieCount:-1}
        },{
            $match:{genre:genre}
        }])
        res.status(200).json({
            status:'success',
            count:movies.length,
            data:{
                movies
            }
        })
})