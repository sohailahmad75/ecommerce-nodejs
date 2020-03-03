const express  = require("express")
require('dotenv').config()
const app = express();




// Routers
app.get("/", ()=>{
    console.log("Hello")
})

// Server 
const port = process.env.PORT ;
app.listen(port, ()=>{
    console.log(`Server is running at ${port}`)
})