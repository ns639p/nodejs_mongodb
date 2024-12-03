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