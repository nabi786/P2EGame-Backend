const jwt = require('jsonwebtoken');

const securityCheckToken = process.env.AUTH_TOKEN;


// this is authentication to authenticate the user here
const auth = (req, res, next)=>{

    // const authToken =  req.headers["authToken"]; 
    const authToken =  req.headers.authtoken
    // console.log(req.headers)

    // console.log("authToken",authToken,req.headers)
    if(!authToken){
       return res.status(403).json({msg:"authToken required"})
    }   
    
    try {
        if(securityCheckToken===authToken){

            return next();

        }else{
            
            return res.status(403).json({msg:" Invalid authToken"})
        }
        // const decoded = jwt.verify(process.env.SECRET_KEY, authToken);
        // const decoded = jwt.verify("m@_y-se!cre0t-clo_se@ds2ea@123p2e729Game", authToken);

        
        
        
      } catch (err) {
        return res.status(401).json({msg : "Invalid authToken"});
      }

} 



module.exports = auth