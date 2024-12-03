const express = require('express');
const fs = require('fs')
const app = express()
const port = 1000
const movies =  JSON.parse(fs.readFileSync('./data/movies.json'));
app.use(express.json())
app.get('/api/v1/movies',(req,res)=>{
    res.status(200).json({
        status:"success",
        data:{
            movies:movies
        }
    })
})


//GET - /api/v1/movies/id
app.get('/api/v1/movies/:id?',(req,res)=>{
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
})


app.post('/api/v1/movies',(req,res)=>{
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
})


app.listen(port,()=>{
    console.log('starting server....')
})