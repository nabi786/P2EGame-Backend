const model = require("../model/model");
const { getTimeStamp, getBoostedValue, userClaimRecord} = require("../blockchain/web3");

var Web3 = require('web3');

// var web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
const web3 = new Web3();





// game won function
const gameWon = async (req, res) => {
  try {
  
    var date = await getTimeStamp();
    // date = '1669167191';
    var winNumber = 1;


      var gameWonStatus = req.body.gameWonStatus;

      var findAddress = await model.p2eGame.findOne({
          Address: req.body.userAddress,
          Date: date,
        });

        // await check claim
       var checkClaim = claimData = await userClaimRecord(req.body.userAddress,date)

       console.log('chec claim', checkClaim)

        if (gameWonStatus === "win") {
          
          // getClaimData
          
          // console.log(findAddress)
          if(findAddress == null || findAddress.lost != true){


    
            var isBoosted = await getBoostedValue(req.body.userAddress);

            if (isBoosted.success != false) {
            if (isBoosted.boosted == true) {
                
                winNumber = 2;
            }



            if (findAddress) {
                
                if(isBoosted.boosted == true){
                    if(findAddress.Wins == 29){
                        findAddress.Wins += (winNumber-1);
                    }else{
                        findAddress.Wins += winNumber
                    }
                }else{
                    findAddress.Wins += winNumber;
                }
               

                if (findAddress.Wins <= 30) {

                    findAddress.Claims = checkClaim
                    await findAddress.save();
                    res.status(200).json({ msg: "game Won", userData: findAddress });

                }else{
                    res.status(200).json({ msg: "won limit ends"});
                }

            } else {
                var data = new model.p2eGame({
                Address: req.body.userAddress,
                Wins: winNumber,
                Date: date,
                Claims : checkClaim
                });

                await data.save();

                res.status(200).json({ msg: "game Won", userData: data });
            }
            } else {
            res.status(200).json({ success: false, msg: "invalid userAddress" });
            }
        

        }else{

            res.status(200).json({ msg: "can not register more win" });

        }
    
    } else if (gameWonStatus === "lost") {

        // console.log(findAddress)
        if(findAddress != null){
          findAddress.lost = true;
          findAddress.Claims = checkClaim
          await findAddress.save()
          res.status(200).json({msg : "can not register more win"});

        }else{
          res.status(200).json({msg : "can not register win"});
        }

    } else {
        res.status(200).json({ msg: "invalid gameWinStatus" });
    }


    



} catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "something went wrong from server", success: false });
  }
};







// get game won by Date

const getWonByDate = async (req, res) => {
  try {
    if (process.env.SECRET_KEY === req.body.secretKey) {
      var getGameWonByDate = await model.p2eGame.find({ Date: req.body.Date });

      if (getGameWonByDate.length > 0) {
        res.status(200).json({ success: true, wonData: getGameWonByDate });
      } else {
        res
          .status(404)
          .json({
            success: false,
            wonData: [],
            msg: "no game won status found in this date",
          });
      }
    } else {
      res.status(200).json({ success: false, msg: "invalid SecretKey" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "something went wrong from server side" });
  }
};







// get all game won by date and address
const getWonByDateAndAddress = async (req, res) => {
  try {
    if (process.env.SECRET_KEY === req.body.secretKey) {
      var getData = await model.p2eGame.find({
        Address: req.body.Address,
        Date: req.body.Date,
      });

      if (getData.length > 0) {
        res.status(200).json({ success: true, gameWonData: getData });
      } else {
        res
          .status(404)
          .json({ success: false, msg: "no data found", gameWonData: [] });
      }
    } else {
      res.status(200).json({ success: false, msg: "invalid secret Key" });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: "something went wrong" });
  }
};






// getWon by address
const getDataByAddress = async (req, res) => {
  try {



      
      
      var addressData = await getFilteredData(req.body.Address)
        



        if (addressData.length > 0)
        {
            res.status(200).json({ success: true, addressData: addressData });
        } else {
            res.status(404).json({ success: false, msg: "no data not found" });
        }



 
} catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "something went wrong from server side" });
  }
};







async function getFilteredData(address){

  var allFilteredData = await model.p2eGame.find({ $and: [ { Address:address}, { $expr: {$gt: ["$Wins","$Claims"] } } ] })
  
    return allFilteredData;

}








function getmessageHash(userAddress_, userIP_, tokenAmount_){

  const data = web3.utils.soliditySha3(userAddress_, userIP_, tokenAmount_);
  return data;
}

function signMessage(msgHash, signerAddress, signerKey){
  web3.eth.defaultAccount = signerAddress;
  const signObj = web3.eth.accounts.sign(msgHash, signerKey);
  return signObj;
}













// claim
const claimUserAllRewards = async (req, res) => {

    try {


        var allFilteredData = await getFilteredData(req.body.Address);
        
        console.log("this is data",allFilteredData)
        
        
        if(allFilteredData.length > 0){
          var jsonObject =[];
          
          var Address = [];
          var signature = [];
          var Wins = [];
          var Date = [];
          
          // await allFilteredData.forEach(async(item,index)=>{
        
          for(var x=0; x < allFilteredData.length; x++){

        
              // blocchain
 
                          
              var newClaimData = await userClaimRecord(allFilteredData[x].Address, allFilteredData[x].Date)
              newClaimData = parseInt(newClaimData)
              
              
              console.log("claim",newClaimData)

              if(newClaimData > allFilteredData[x].Claims){

                allFilteredData[x].Claims = newClaimData;
                await allFilteredData[x].save()

              } 

              var winsMinusClaim = allFilteredData[x].Wins - newClaimData;
              // console.log("winsMinusClaim",winsMinusClaim)

              // console.log("item address", item.Address)
              // console.log("item item.Wins", item.Wins)
              // console.log("item item.Date", item.Date)


              if(allFilteredData[x].Claims < allFilteredData[x].Wins){
                
                
               var hash = getmessageHash(allFilteredData[x].Address, winsMinusClaim, allFilteredData[x].Date)
                // var sign = await signMessage(hash, process.env.SIGNER_ADDRESS, process.env.SIGNER_PK);
              var sign = signMessage(hash, process.env.SIGNER_ADDRESS, process.env.SIGNER_PK)
                
                console.log("this is Hash", sign);

                 Address.push(allFilteredData[x].Address);
                 signature.push(sign);
                 Wins.push(winsMinusClaim);
                 Date.push(allFilteredData[x].Date);
             

                
              }
              
            // });
          }
            jsonObject.push({"Address" : Address,"signature" : signature, "Wins" : Wins, "Date" : Date})
            console.log("jsonObject", jsonObject)
          

            // console.log("this si claim ary", signsAry)
            // var responseObject = {claimsAry,userAddress,DatesAry,signsAry};


            res.status(200).json({success : true, jsonObject : jsonObject});

          }else{
            
            res.status(200).json({success : false, responseObject : []});
        }

        // in loop body 
        // claims = win-claims
        // res.send({"status":true,"signature": sign.signature});
        // res.send({"status":true,"signature" : "sign"});
        // arry of final response 
        // arry claims,userAddress, Date,sign
    
        

   
  } catch (error) {
    console.log(error)
      res
        .status(500)
        .json({ success: false, msg: "something went wrong from server side" });
    }
};
  



















// making object
const gameWonObject = {
  gameWon,
  getWonByDate,
  getWonByDateAndAddress,
  getDataByAddress,
  claimUserAllRewards
};



module.exports = gameWonObject;
