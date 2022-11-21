var Web3 = require('web3');

var web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');


const erc20Abi = require("../ABIs/Erc20TokenABI.json")

const getTokenBalance = async(tokenAddress,walletAddress)=>{

    // console.log('this si address', address)
   const tokenContract = new web3.eth.Contract(erc20Abi,tokenAddress);

   var getTokenBalance = await tokenContract.methods.balanceOf(walletAddress).call();

   getTokenBalance = await web3.utils.fromWei(getTokenBalance, "ether")

   return getTokenBalance;

}


module.exports = {getTokenBalance};




