const express  = require("express")
require('dotenv').config()
const mongoose = require("mongoose")
const morgan = require ("morgan")
const expressValidator = require("express-validator")
const bodyParser = require ("body-parser")
const cookieparser = require("cookie-parser")

// Import Router
const authRouter = require ("./router/auth")
const userRouter = require ("./router/user")
const categoryRouter = require ("./router/category")
const productRouter = require ("./router/product")
// app
const app = express();


// db
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(() => {
console.log(`Connected to Database at : ${process.env.DATABASE}`);
})
.catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});
// MiddleWares
app.use(morgan("dev"));
app.use(bodyParser.json())
app.use(cookieparser())
app.use(expressValidator())
// Routers MiddleWare
app.get("/", (req,res)=> { res.end("Home Route")})
app.use("/api", authRouter)
app.use("/api", userRouter)
app.use("/api", categoryRouter)
app.use("/api", productRouter)

// Server 
const port = process.env.PORT ;
app.listen(port, ()=>{
    console.log(`Server is running at ${port}`)
})