const { generateCode } = require("../helper/generateInviteCode");
const schoolModel = require("../models/schoolModel");

async function createSchool(req, res, next){
    try {
     //  let  teacher_invite_code, 
         req.body.teacher_invite_code = "teach_"+generateCode();
         req.body.parent_invite_code = "par_"+generateCode();

         var school_images = (req.files && req.files.length > 0) ? req.files.filter((data) => data.fieldname == "school_image") : null
       
         req.body.school_image = (school_images && school_images.length > 0) ? `uploads/users/` + school_images[0].filename : null
        
         let {school_name, school_image, user_id} = req.body;
       
         if(!school_name || !school_image || !user_id){
            return res.status(400).json({
                success : false,
                message : "All fields are required...!"
            })
         }
         if(req.user.user_role == 'Admin'){
        let schoolData = await schoolModel.addNewSchool(req);

        if(schoolData.rowCount>0){
            return res.status(201).json({success : true,
                 message : "Your New School is Created Successfully",
                 data : schoolData.rows,
                })
        }else{
            return res.status(400).json({
                success : false,
                message : "Sorry, Unable to create new School...!",
            })
        }
    }else{
        return res.status(400).json({
            success : false,
            message : "Sorry, You don't have access to create new School...!",
        })
    }
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Some Internal Server Error",
            error : error.message,
        })
    }
}

async function getMySchools(req, res, next){
    try {
         let user_id = req.query.user_id
         if(!user_id){
            return res.status(400).json({
                success : false,
                message : "Userid required...!"
            })
         }

         let schoolDetails = await schoolModel.getAllSchools(req);
       
         if(schoolDetails.rowCount>0){
            return res.status(200).json({
                success : true,
                message : "Your schools List",
                data : schoolDetails.rows,
            })
         }else{
            return res.status(404).json({
                success : false,
                message : "Sorry, You don't have any schools"
            })
         }
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Some Internal Server Error",
            error : error.message,
        })
    }
}

async function shareInviteCode(req, res, next){
    try {
         let {school_id, type, new_user_email} = req.body;
         if(!school_id){
            return res.status(400).json({
                success : false,
                message : "School_id is required...!"
            })
         }
         /// we can implement sms or email service here to share invite code
         let schoolData = await schoolModel.shareInvitationCode(req);
         if(schoolData.rowCount>0){
           let invitation_code, message;
         if(type == 'Parents'){
           invitation_code = schoolData.rows[0].parent_invite_code
           message = {
            message : `Hello Dear Parent you have signup invitation from ${schoolData.rows[0].school_name}. Please signup using our invitation code : ${invitation_code}`
           }
        
         }else{
            invitation_code = schoolData.rows[0].teacher_invite_code
            message = {
                message : `Hello Dear Teacher you have signup invitation from ${schoolData.rows[0].school_name}.
                           Please signup using our invitation code : ${invitation_code}`
            }
         }
            return res.status(200).json({
                success : true,
                message : message,
            })
        }else{
            return res.status(404).json({
                success : false,
                message : "School not found",
              
            })
        }
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Some Internal Server Error",
            error : error.message,
        })
    }
}
module.exports = {getMySchools, createSchool, shareInviteCode};