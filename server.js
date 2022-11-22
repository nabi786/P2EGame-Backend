import express from 'express';
import cors from 'cors';
import  bodyParser from "body-parser";
import Web3 from 'web3';
import fetch from "node-fetch";
import dotenv from 'dotenv';
dotenv.config();
const web3 = new Web3();
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.post('/getSign', (req, res) =>{
    var dates = req.body.dates;
  var claims = req.body.claims;
  var userAddr = req.body.userAddress
  console.log(dates, claims);
   
            
            var hash = getmessageHash(userAddr, claims, dates);
            var sign = signMessage(hash, process.env.SIGNER_ADDRESS, process.env.SIGNER_PK);
            res.send({"status":true,"signature": sign.signature});
  
})

app.listen(port, () => {
  console.log(`Airdrop server running at http://0.0.0.0:${port}`)
})
function getmessageHash(userAddress_, userIP_, tokenAmount_){
    const data = web3.utils.soliditySha3(userAddress_, userIP_, tokenAmount_);
    return data;
}
function signMessage(msgHash, signerAddress, signerKey){
    web3.eth.defaultAccount = signerAddress;
    const signObj = web3.eth.accounts.sign(msgHash, signerKey);
    return signObj;
}