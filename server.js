const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})


process.on('uncaughtException',(err)=>{
  console.log(err.name,err.message);
  console.log('Uncaught exception occured! shutting down...');
  process.exit(1);
})

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




const port = process.env.PORT||1000;
const server = app.listen(port,()=>{
    console.log('server has started....');
})


process.on('unhandledRejection',(err)=>{
  console.log(err.name,err.message);
  console.log('Unhandled rejection occured! shutting down...');
  server.close(()=>{
    process.exit(1);
  })
})