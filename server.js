const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

const app = require('./app')

// console.log(app.get('env'))
console.log(process.env)

app.listen(1000,()=>{
    console.log('server has started....');
})