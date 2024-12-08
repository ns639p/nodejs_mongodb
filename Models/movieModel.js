const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is a required field'],
        unique:true,
        trim:true
    },
    description:{
        type:String,
        required:[true,'Name is a required field'],
        trim:true
    },
    duration:{
        type:Number,
        required:[true,'Duration is a required field']
    },
    ratings:{
        type:Number,
    },
    totalRatings: {
        type:Number
    },
    releaseYear:{
        type:Number,
        required:[true,'Release year is a required field']
    },
    releaseDate:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    genres:{
        type:[String],
        required:[true,'Genres is required field']
    },
    directors:{
        type:[String],
        required:[true,'directors is required field']
    },
    coverImage:{
        type:[String],
        required:[true,'coverImage is required field']
    },
    actors:{
        type:[String],
        required:[true,'actors is required field']
    },
    price:{
        type:Number,
        required:[true,'price is a required field']
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});


movieSchema.virtual('durationInHours').get(function(){
    return this.duration/60
})

const Movie = mongoose.model('Movie',movieSchema);


module.exports=Movie