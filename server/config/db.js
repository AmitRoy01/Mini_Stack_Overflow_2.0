

const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
const connectDB= ()=>{
  mongoose.connect(process.env.CONNECTION).then(()=>{console.log("successfully connected to Database")}).catch((error)=>{
    console.log(error)
  })}
module.exports=connectDB;