const mongoose = require('mongoose');
const fs = require('fs')
const movieSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is a required field'],
        maxLength:[100,'Movie name must be less than 100 characters'],
        minLength:[3,'Movie name must contain more than three characters'],
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
        min:[1,'ratings must be greater than or equal to 1'],
        max:[10,'ratings must be lesser than or equal to 10']
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
        required:[true,'Genres is required field'],
        enum:{
            values:['Action','Adventure','Sci-Fi','Thriller','Comedy','Crime','Biography','Drama','Romance','Fantasy'],
            message:'This genre doest exist'
        }
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
    },
    createdBy:String
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});


movieSchema.pre('save',function(next){
    this.createdBy = 'Naren';
    next()
})

movieSchema.post('save',function(doc,next){
    const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`;
    fs.writeFileSync('./Log/log.txt',content,{flag:'a'},(err)=>{
        console.log(err.message)
    })
    next();
})


const findMethods = ['find', 'findOne'];

findMethods.forEach(method => {
    movieSchema.pre(method, function(next) {
        this.startTime = Date.now();
        // Optional: filter for movies with release date less than or equal to now
        this.where('releaseDate').lte(Date.now());
        next();
    });

    movieSchema.post(method, function(docs, next) {
        const endTime = Date.now();
        const content = `${method.toUpperCase()} query returned in ${endTime - this.startTime} milliseconds\n`;
        fs.appendFile('./Log/log.txt', content, (err) => {
            if (err) console.error(err);
        });
        next();
    });
});

movieSchema.pre('aggregate',function(next){
    console.log(this.pipeline().unshift({$match:{releaseDate:{$lte:new Date()}}}));
    next();
})

movieSchema.virtual('durationInHours').get(function(){
    return this.duration/60
})

const Movie = mongoose.model('Movie',movieSchema);


module.exports=Movie