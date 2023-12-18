const {pool} = require("../db/db");

async function addNewSchool(req){
    let insertQuery = `INSERT INTO schools (school_name, school_image, teacher_invite_code, parent_invite_code, user_id)
    VALUES($1, $2, $3, $4, $5) returning school_name, school_image`;
    let values = [req.body.school_name, req.body.school_image, req.body.teacher_invite_code, req.body.parent_invite_code, req.body.user_id];
    let result = await pool.query(insertQuery, values);
    return result;
}

async function getAllSchools(req){ 
       let getQuery;
       if(req.user.user_role == 'Admin'){
            getQuery = `SELECT s.*, u.user_role FROM schools s INNER JOIN users u ON u.user_id=s.user_id WHERE s.user_id = $1`;
       }else{
        getQuery = `SELECT s.*, u.user_role FROM users u INNER JOIN schools s ON s.school_id=u.invite_school_id where u.user_id=$1`;
       }
    let result = await pool.query(getQuery, [req.query.user_id]);
    return result;
}

///  share invitation code 

async function shareInvitationCode(req){
    let getQuery = `select school_name, teacher_invite_code, parent_invite_code from schools where school_id=$1`;
    let result = await pool.query(getQuery, [req.body.school_id]);
    return result;
}
module.exports = {addNewSchool, getAllSchools, shareInvitationCode};