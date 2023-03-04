const mongoose=require("mongoose")
const colors=require('colors')
const dotenv=require('dotenv')
dotenv.config()

const connectDB= async()=>{
    try{
await mongoose.connect(process.env.MONGODB_URL)
console.log(`Mongo db connected ${mongoose.connection.host}`.bgGreen.white)
    }
    catch(err){
console.log(`Mongodb server issue ${err}`.bgRed.white)
    }
}

module.exports=connectDB