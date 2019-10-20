const express = require('express');
const expressValidator = require('express-validator');
const app = new express();
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser');

dotenv.config();

mongoose.connect( process.env.MONGO_URI )
.then(()=> 
    console.log("DATABASE CONNECTED!!!!!!!!!!")
)
         
mongoose.connection.on('error', err => {
    console.log(`Connection Error ${err.message}`)
})


const postRoutes = require("./Routes/post.js")
const authRoutes = require("./Routes/auth.js") 
const userRoutes = require("./Routes/user.js") 
 //api docs

 app.get("/", (req,res)=>{
   fs.readFile('docs/apiDocs.json', (err, post) => {
     if (err) {
       res.status(400).json({
         error: err
       })
     }
     const docs = JSON.parse(post)
     res.json(docs)
   })
 })

app.use(bodyParser.json());
app.use(expressValidator());
app.use (cors());
app.use ("/" , postRoutes) ;
app.use ("/" , authRoutes) ;
app.use ("/" , userRoutes) ;

 
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({error : "Unauthorized User !!!!!!"
      });
    }
  });

app.listen(process.env.PORT, () =>{
    console.log(`Server is running at port ${process.env.PORT}`);
});