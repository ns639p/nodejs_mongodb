const express = require('express');
const fs = require('fs')
const morgan = require('morgan')//this is a HTTP logging middleware
const app = express()
const port = 1000
const movies =  JSON.parse(fs.readFileSync('./data/movies.json'));

const logger = function(req,res,next){
    console.log('custom middleware called');
    next()
}

app.use(express.json())
app.use(morgan('dev'))//morgan is not a middle ware this is a function that returns a middle ware. Search 'morgan github' in google and open the index.js file in line 59 you will see the morgan functon taking in only two parameters but it returns a middleware function called logger (line 103) that takes three parameters req,res and next
app.use(logger)//the above two have () but this doesnt why ? because this is a middleware function and takes three parameters req,res,next
app.use((req,res,next)=>{
    req.requestedAt = new Date().toISOString();
    next();
})

//Route handler function 
const getAllMovies = (req,res)=>{
    res.status(200).json({
        status:"success",
        requestedAt:req.requestedAt,
        data:{
            movies:movies
        }
    })
}

const getMovie = (req,res)=>{
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


const createMovie = (req,res)=>{
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


const updateMovie = (req,res)=>{
    
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


const deleteMovie = (req,res)=>{
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

    // app.get('/api/v1/movies',getAllMovies)
    // app.get('/api/v1/movies/:id',getMovie)
    // app.post('/api/v1/movies',createMovie)
    // app.patch('/api/v1/movies/:id',updateMovie)
    // app.delete('/api/v1/movies/:id',deleteMovie)


app.route('/api/v1/movies')
    .get(getAllMovies)
    .post(createMovie)

app.route('/api/v1/movies/:id')
    .get(getMovie)
    .patch(updateMovie)
    .delete(deleteMovie)


app.listen(port,()=>{
    console.log('starting server....')
})