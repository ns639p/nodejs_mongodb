const express = require('express');
const app = express()
const port = 1000
app.get('/',(req,res)=>{
    res.status(500).json({message:'Welcome to express js'})
})
app.post('/',()=>{
    
})
app.listen(port,()=>{
    console.log('starting server....')
})