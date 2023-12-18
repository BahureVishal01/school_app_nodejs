  const userModel = require("../models/userModel");
 const bcrypt = require("bcrypt")
 const  dotenv  = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config()
let secretKey = process.env.JWT_SECRET

  async function registerUser(req, res, next){
     try {
          
            var user_images = (req.files && req.files.length > 0) ? req.files.filter((data) => data.fieldname == "user_image") : null
       
            req.body.user_image = (user_images && user_images.length > 0) ? `uploads/users/` + user_images[0].filename : null
            const { user_name, user_email, user_password, user_image, invitation_code } = req.body;
          
            
            if (!user_name || !user_email || !user_image || user_image == null || !user_password) {
              return res.status(400).json({
                sucess: false,
                message: "All fields are required...!",
              });
            }
            if(!invitation_code || invitation_code == undefined){
              return res.status(400).json({
                sucess: false,
                message: "Don't have invitation code?, do you want to create new school?",
              });
            }  


            let checkExistingEmail = await userModel.checkEmail(user_email);
            let  emailCount = checkExistingEmail?.rows[0]?.count || 0
           
            if(emailCount > 0){
                return res.status(400).json({
                    success : false,
                    message : "Please provide another email id..!"
                })
            }
            
            req.body.user_password = await bcrypt.hash(req.body.user_password, 10);

         let data =  await userModel.signupUser(req)
          
           return res.status(201).json({
            success :true,
            message : "Congratulations you are succesfully registered." ,
            userData : data,
        })
     } catch (error) {
        res.status(500).json({
            success : false,
            message : "Some Internal Server error...!",
            error : error.message
        })
     }
  }


async function userLogin(req, res, next){
    try {
          const {user_email, user_password} = req.body;
          
          let  userData = await userModel.checkEmail(user_email);
          if(userData.rowCount>0){

            let isMatchingPassword = await bcrypt.compare(
                user_password,
                userData.rows[0].user_password
              );
              if (isMatchingPassword) {
                let userData = {
                  user_id : userData?.rows[0]?.user_id,
                 // user_email : req.body.user_email,
                 // user_role : userData?.rows[0]?.user_role,
              }
          const token = jwt.sign(userData,secretKey, { expiresIn: '1d' });

                return res.status(200).json({
                    success : true,
                    message :"Login successfull..",
                    token : token,
                    data : userData.rows,
                })
              }else{
                return res.status(400).json({
                    success : false,
                    message :"User Name or Password is wrong. Please provide right credentials",
                })
              }
          }else{
            return res.status(400).json({
                success : false,
                message :"User Name or Password is wrong. Please provide right credentials",
            })
          }

    } catch (error) {
        //next()
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "Some Internal Server error...!",
            error : error.message
        })
    }
}
  module.exports = {registerUser, userLogin}