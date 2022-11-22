const express = require('express');
const router = express.Router();

const gameWonObj = require('../controller/gameWon');


const auth = require("../auth/auth")


// post win
router.post("/wonGame",auth, gameWonObj.gameWon);



// get all Game Won
router.get("/getWonByDate", gameWonObj.getWonByDate);

// get all won games by date and address
router.get('/getGameWonByDateAndAddress',gameWonObj.getWonByDateAndAddress);

// search by Address
router.get('/getDataByAddress',gameWonObj.getDataByAddress);


// claimUserAllRewards
router.get('/claimUserAllRewards',gameWonObj.claimUserAllRewards);



module.exports = router;