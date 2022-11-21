require("dotenv").config();

require("./config/DataBase");
const express = require('express');
const app = express();
const PORT = 3000;
// const bodyParser = require('body-parser')


app.use(express.urlencoded({extended : true}));
app.use(express.json());


// get Routers
const gameWon = require("./routers/gameWon");


// use routers
app.use('/api', gameWon)



app.get('/',(req,res)=>{
    res.status(200).json({msg: "P2E Game backend is running"})
})



app.listen(PORT, function(){
    console.log('server started successfully')
})
