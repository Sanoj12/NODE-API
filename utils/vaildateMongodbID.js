const mongoose=require('mongoose');
const vaildateMongoDbId= (id)=>{
    const vaild=mongoose.Types.ObjectId.isValid(id);
    if(!vaild) throw new Error("This id is not found");

};



module.exports=vaildateMongoDbId;