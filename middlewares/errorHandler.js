// not found

const notFound=(req,res,next)=>{
    const error=new Error(`not found ${req.orginalUrl}`);
    res.status(400);
    next(error);
}


//Error handler

const errorHandler=(req,res,next)=>{
    const statuscode=res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statuscode);
    res.json({
        message:err?.message,
        stack:err?.stack
    });
}

module.exports={notFound,errorHandler}