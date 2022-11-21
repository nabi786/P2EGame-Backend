const model = require("../model/model")
const {getTokenBalance} = require('../blockchain/web3')



// check bosted to check
function checkBoosted(address){    
    return false;
}



// game won function
const gameWon = async (req,res)=>{
    
    try {

        
        // getDate
        var date = new Date();
        date = date.toLocaleDateString()
        // date = '11/26/2022'
        var winNumber = 1;

        if(process.env.SECRET_KEY === req.body.secretKey){

       

            var gameWonStatus = req.body.gameWonStatus;

            if(gameWonStatus === "win"){
                
                var findAddress = await model.p2eGame.findOne({Address : req.body.userAddress,Date : date})

                var isBoosted = checkBoosted(req.body.userAddress)

                if(isBoosted == true){
                    winNumber = 2
                }

                    // getting Balance of token 
                    // await getTokenBalance("tokenAddress","walletAddress")
                    var Balance = await getTokenBalance("0x40E43bEc9207AC6d9Ca75c473b9048EA7f5a6764","0x4403c35cCe9eDB32f01D32ac0b25F0aDBB98Bf20")
                    console.log('this is tokenBalance in Ether', Balance);

                    if(findAddress){
                        
                    
                        if(isBoosted != true){
                            findAddress.Wins += 1;
                        }else{
                            findAddress.Wins += winNumber;
                        }
                
                        if(findAddress.Wins < 30){
                            await findAddress.save()
                        }


                        res.status(200).json({msg : "game Won", userData  : findAddress})
                    }else{

                        
                        var data = new model.p2eGame({
                            Address : req.body.userAddress,
                            Wins : winNumber,
                            Date : date
                        })
                
                        await data.save();

                        res.status(200).json({msg : "game Won", userData  : data})
                    }


                
            }else if(gameWonStatus === "lost"){
                res.status(200).json({msg : "you lost"})
            }else{
                res.status(200).json({msg : "invalid gameWinStatus"})
            }


        }else{
            res.status(200).json({success : false, msg : "invalid SecretKey"})
        }   

    } catch (error) {
        console.log(error)
        res.status(500).json({msg : "something went wrong from server", success : false})
    }
}





// get game won by Date

const getWonByDate = async (req,res)=>{

    try {
        
        if(process.env.SECRET_KEY === req.body.secretKey){


                var getGameWonByDate = await model.p2eGame.find({Date : req.body.Date})

                if(getGameWonByDate.length > 0){

                    res.status(200).json({success : true, wonData :  getGameWonByDate})

                }else{

                    res.status(404).json({success: false , wonData : [], msg : "no game won status found in this date"})
                }
        }else{  
            res.status(200).json({success: false ,  msg : "invalid SecretKey"})
        }

    } catch (error) {
        res.status(500).json({success : false, msg : "something went wrong from server side"})
    }

}






// get all game won by date and address
const getWonByDateAndAddress = async(req,res)=>{
    try {
        
        if(process.env.SECRET_KEY === req.body.secretKey){
            

                var getData = await model.p2eGame.find({Address : req.body.Address, Date : req.body.Date})

                if(getData.length > 0){

                    
                    res.status(200).json({success: true ,gameWonData :  getData})
                }else{
                    res.status(404).json({success : false, msg : "no data found", gameWonData : []})
                }

                
        }else{
                
            res.status(200).json({success : false, msg : "invalid secret Key"})
        }        
    } catch (error) {
        res.status(500).json({success : false ,msg : "something went wrong"});
    }
}






// search by address
const getDataByAddress = async(req,res)=>{
    try {


        if(process.env.SECRET_KEY === req.body.secretKey){

                
                var addressData = await model.p2eGame.find({Address : req.body.Address});

                if(addressData.length > 0){

                    

                    res.status(200).json({success : true, addressData : addressData})            
                }else{


                    res.status(404).json({success : false,msg : "no data not found"})            
                }
                
        }else{
                
            res.status(200).json({success : false,msg : "invalid SecretKey"})            
        }
    } catch (error) {
        res.status(500).json({success : false,msg : "something went wrong from server side"})            
    }
}











const gameWonObject={
    gameWon,getWonByDate,getWonByDateAndAddress,getDataByAddress
}











module.exports = gameWonObject;