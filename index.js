const express = require('express');
const dbconnect = require('./config/db');
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 3000;
const userRouter = require('./routes/user');
const productRouter=require('./routes/product')
const blogRouter=require('./routes/blog')
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan=require('morgan');
dbconnect();


app.use(morgan("dev"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

 
app.use('/user', userRouter);
app.use('/product',productRouter)
app.use('/blog',blogRouter)


app.use(notFound);
app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
})