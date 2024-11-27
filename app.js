const express = require("express")
const mongoose = require("mongoose")
const app = express()
const router = require('./router/router')

app.use(express.json())

mongoose.connect("mongodb://localhost:27017/merchant")
.then(()=>{
    console.log("mongodb connect successfully")
})
.catch(()=>{
    console.log("mongodb not connected")
})


app.listen(4300,()=>{
    console.log("server is running on port 4300");
})

app.use('/v1/store-user',router);

module.exports = app;