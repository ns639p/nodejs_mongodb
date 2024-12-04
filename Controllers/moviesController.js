const fs = require('fs')
const movies =  JSON.parse(fs.readFileSync('./data/movies.json'));


exports.getAllMovies = (req,res)=>{
    res.status(200).json({
        status:"success",
        requestedAt:req.requestedAt,
        data:{
            movies:movies
        }
    })
}

exports.getMovie = (req,res)=>{
    //console.log(req.params);
    const id = req.params.id * 1; // the id is stored as a string in request.params multiplying it by 1 will turn it into a number or you the add symbol in front like this +req.params.id
    let movie = movies.find(el=>el.id===id)

    if (!movie){
        return res.status(404).json({
            status:'Failed',
            message:'Movie with ID ' +id+ ' is not found'
        })
    }

    res.status(200).json({
        status:"success",
        data:{
            movie:movie
        }
    })
}


exports.createMovie = (req,res)=>{
    const newId = movies[movies.length-1].id+1;
    const newMovie = Object.assign({id:newId},req.body)
    movies.push(newMovie);

    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        res.status(201).json({
            status:"success",
            data:{
                movie:newMovie
            }
        })
    })
    //res.send('created')
}


exports.updateMovie = (req,res)=>{
    
    const id = req.params.id * 1;
    const movieToUpdate = movies.find(el=>el.id===id);
    if (!movieToUpdate){
        
        return res.status(404).json({
            status:'failed',
            message:'Movie with ID ' +id+ ' is not found'
        })
    }
    let index = movies.indexOf(movieToUpdate);
    Object.assign(movieToUpdate,req.body);//we are passing two objects to Object.assign what happens is the two object will be merged if thy have the same properties then no problem if they have the different properties the property of second object will be implemented
    movies[index] = movieToUpdate
    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        
        res.status(200).json({
            status:'success',
            data:{
                movie:movieToUpdate
            }
        })
    })
}


exports.deleteMovie = (req,res)=>{
    const id = req.params.id * 1;
    const movieToDelete = movies.find(el=>el.id===id);

    if (!movieToDelete){
        
        return res.status(404).json({
            status:'failed',
            message:'Movie with ID ' +id+ ' is not found to delete'
        })
    }
    const index = movies.indexOf(movieToDelete);

    movies.splice(index,1)

    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        console.log('hits write file')
        res.status(204).json({
            status:'success',
            data:{
                movie:null
            }
        })
    })
}