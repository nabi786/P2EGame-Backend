require("dotenv").config();
const jwt = require('jsonwebtoken');
require("./config/DataBase");
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors= require('cors')

const bodyParser = require('body-parser')
// const bodyParser = require('body-parser')



app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended : true}))


// get Routers
const gameWon = require("./routers/gameWon");


// use routers
app.use('/api', gameWon)


// assinging secretKey
// jwt.sign(process.env.SECRET_ID, process.env.SECRET_KEY)


app.get('/',(req,res)=>{
    res.status(200).json({msg: "FootBall Game backend is running"})
})



app.listen(PORT, "0.0.0.0", function(){
    console.log('server started successfully')
})
