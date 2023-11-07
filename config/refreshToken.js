const jwt=require('jsonwebtoken');

const accessRefreshToken=(id)=>{
    return jwt.sign({id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"3d"})
}

module.exports={accessRefreshToken}