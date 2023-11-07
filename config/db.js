const mongoose=require('mongoose')
const dotenv =require('dotenv').config()
const  dbconnect=()=>{
    try{
        const connects=mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
        console.log("databased cpnnected successfully");
    }
    catch(err){
       console.log(err);
    }
}
module.exports=dbconnect;