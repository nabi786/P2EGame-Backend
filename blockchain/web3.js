var Web3 = require('web3');

var web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');


const footBallContractABI = require("../ABIs/footballContract.json");

const contractAddress = '0x6b409AEE3B96666252cE9EC606D7258dE83e92F3';

const footBallContract = new web3.eth.Contract(footBallContractABI,contractAddress);


const getTimeStamp = async()=>{

    // console.log('this si address', address)

   var getTimeStamp = await footBallContract.methods.getDateStamp().call();


   return getTimeStamp;

}



const getBoostedValue = async(walletAddress)=>{

    try{

        var isBoosted = await footBallContract.methods.isBoosted(walletAddress).call();

        var boostedObject = {
            boosted : isBoosted,
            // boosted : true,
            success : true,
        }

        return boostedObject;
        
    }catch(err){
        var boostedObject = {
            boosted : "",
            success : false,
        }
        return boostedObject
    }
}





// userClaimRecord
const userClaimRecord = async(walletAddress,timeStamp)=>{



        var userClaim = await footBallContract.methods.userClaimRecord(walletAddress,timeStamp).call();



        return userClaim;
        // return 5;
        

}




module.exports = {getTimeStamp, getBoostedValue,userClaimRecord};




