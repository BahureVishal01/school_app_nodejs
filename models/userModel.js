const {pool} = require("../db/db");
const crypto = require('crypto');
const  dotenv  = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config()
let secretKey = process.env.JWT_SECRET
function generateApiKey(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}
async function signupUser(req){
     let api_key = generateApiKey();
      let code = req.body.invitation_code.split("_")[0];
      let  school_id ;
      var user_role;
    
     if(code == 'par'){
        user_role = "Parents"
         let getQuery = `select school_id from schools where parent_invite_code = $1`; 
        let data = await pool.query(getQuery, [req.body.invitation_code]);
        school_id = data.rows[0].school_id
     

     }else if(code == 'teach'){
        user_role = "Teacher";
        let getQuery = `select school_id from schools where teacher_invite_code = $1`; 
        let data = await pool.query(getQuery, [req.body.invitation_code]);
        school_id = data.rows[0].school_id
       
     }else{
        school_id = null
        user_role = "Admin"
     }
    let instertQuery = `INSERT INTO users (user_name, user_email, user_password, user_image, user_role, invite_school_id, api_key)
    VALUES ($1, $2, $3, $4, $5, $6, $7) returning user_id,user_name, user_email, user_image, user_role, invite_school_id, api_key
    `;
    const values = [req.body.user_name, req.body.user_email, req.body.user_password, req.body.user_image, user_role, school_id, api_key];
    let result = await pool.query(instertQuery, values);
    let userData = {
        user_id : result?.rows[0]?.user_id,
        user_email : req.body.user_email,
        user_role : user_role
    }
const token = jwt.sign(userData, secretKey, { expiresIn: '1d' });
    return {token : token, data:result.rows};
}

async function checkEmail(user_email){
    let getQuery = 'SELECT * from users where user_email = $1';
    let result = await pool.query(getQuery, [user_email]);
    return result
}

module.exports = {signupUser, checkEmail};