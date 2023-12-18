const jwt = require("jsonwebtoken");
const { checkEmail } = require("../models/userModel");

const verifyAuth = async (req, res, next) => {
  try {
   
    const authorization = req.headers.authorization;
    const apiKey = req.headers.api_key
 
    if (!authorization || !apiKey) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access...!",
      });
    };

    const decodedData = jwt.verify(authorization, process.env.JWT_SECRET);

    // console.log("decodedData",decodedData);
    const getUser = await checkEmail(decodedData.user_email);

    if (getUser.rowCount > 0) {
      req.user = getUser.rows[0];
      let data = getUser.rows[0];
    
       if(data.api_key == apiKey){
        next();
       }else{
        return res.status(401).json({
            success: false,
            message: "Unauthorized access...!",
          });
       }
      // console.log("req.user===", req.user);
     
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access...!",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = verifyAuth;