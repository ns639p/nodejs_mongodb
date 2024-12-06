const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

const app = require('./app')

// console.log(app.get('env'))
console.log(process.env)

mongoose.connect(process.env.CONN_STR)
  .then((conn) => {
    console.log(conn);
    console.log('DB connection successful');
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });


const movieSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is a required field'],
        unique:true
    },
    description:String,
    duration:{
        type:Number,
        required:[true,'Duration is a required field']
    },
    ratings:{
        type:Number,
        default:1.0
    }
});

const Movie = mongoose.model('Movie',movieSchema);

const testMovie = new Movie({
    name:"dont Die hard",
    description:"Action packed movie staring bruce willis in a thrilling movie",
    duration:139,
    ratings:4.5
})

testMovie.save()
.then(data=>{
    console.log(data)
}).catch(err=>{
    console.log(err)
})

const port = process.env.PORT||1000;
app.listen(port,()=>{
    console.log('server has started....');
})