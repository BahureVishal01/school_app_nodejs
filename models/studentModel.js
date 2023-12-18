const {pool} = require("../db/db");

async function createStudent(req){
    let insertQuery = `INSERT INTO students (student_name, student_image, school_id) VALUES($1, $2, $3) returning *`;
    let result = await pool.query(insertQuery, [req.body.student_name, req.body.student_image, req.body.school_id]);
    return result;
}

async function getAllStudent(req){
    let getQuery = `SELECT * from students where school_id = $1`;
    let result = await pool.query(getQuery, [req.query.school_id])
    return result;
}

// assign student to class
async function assignStudent(req){
    let insertQuery = `INSERT INTO assigned_classes (class_id , student_id)  values($1, $2) returning *`;
    let result = await pool.query(insertQuery, [req.body.class_id, req.body.student_id])
    return result;
}

/// check this class is already assign to this student or not

async function  checkAssignClassOfStudent(req){
    let getQuery = `SELECT  COUNT(*) from assigned_classes where class_id=$1 AND student_id=$2`;
    let result = await pool.query(getQuery, [req.body.class_id, req.body.student_id])
    console.log(result.rows)
    return result;
}

/// for student and class dropdown list
async function studentClassDropdownList(req){
    let result;
    if(req.query.type == 'student'){
    let getQuery= `select student_id, student_name from students where school_id=$1`;
     result = await pool.query(getQuery, [req.query.school_id]);
    }else{
        let getQuery= `select class_id, class_name from class where school_id=$1`;
        result = await pool.query(getQuery, [req.query.school_id]); 
    }
    return result
}
// Get student which are all part of all class
async function getStudents(req){
   let getQuery = `SELECT s.student_id, s.student_name
   FROM students s
   LEFT JOIN assigned_classes ac ON s.student_id = ac.student_id
   LEFT JOIN classes c ON ac.class_id = c.class_id
   WHERE s.school_id = $1
   GROUP BY s.student_id, s.student_name
   HAVING COUNT(DISTINCT c.class_id) = (SELECT COUNT(*) FROM classes)`;
   let  result = await pool.query(getQuery, [req.query.school_id]);
   return result;
}
/// specific students classmates list
async function getClassmates(req){
    let getQuery = `SELECT s.student_id, s.student_name
    FROM students s
    JOIN assigned_classes ac ON s.student_id = ac.student_id
    WHERE ac.class_id IN (
        SELECT class_id
        FROM assigned_classes
        WHERE student_id = $1
    )
    AND s.student_id <> $1`;
    let  result = await pool.query(getQuery, [req.query.student_id]);
   return result;
}
module.exports = {createStudent, getAllStudent, assignStudent, checkAssignClassOfStudent, studentClassDropdownList, getStudents, getClassmates};