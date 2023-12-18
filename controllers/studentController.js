const studentModel = require("../models/studentModel");

async function createNewStudent (req, res, next){
    try {
 
        var images = (req.files && req.files.length > 0) ? req.files.filter((data) => data.fieldname == "student_image") : null
       
        req.body.student_image = (images && images.length > 0) ? `uploads/users/` + images[0].filename : null

        let  {school_id, student_name, student_image} = req.body

        if(!school_id || !student_name || !student_image || student_image == null){
            return res.status(400).json({
                success : false,
                message : "All fields are required...!"
            })
        }
        
       if(req.user.user_role == 'Admin'){
        let studentData = await studentModel.createStudent(req);
        if(studentData.rowCount == 0){
            return res.status(400).json({
                success : false,
                message : "Sorry, Unable to add new student...!",
            })
        }
        return res.status(201).json({
            success : true,
            message : "New Student is added successfully..",
            data : studentData.rows,
        })
        }else{
            return res.status(400).json({
                success : false,
                message : "Sorry, You don't have access to add new Student. ..!",
            })
        }
    
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Some internal server error...",
            error : error.message,
        })
    }
}

async function getAllStudent (req, res, next){
    try {
        let school_id = req.query.school_id
        if(!school_id){
            return res.status(400).json({
                success : false,
                message : "school_id required...!"
            })
        }
       let studentData = await studentModel.getAllStudent(req);
        if(studentData.rowCount>0){
            return res.status(200).json({
                success : false,
                message : "Classes List!",
                data : studentData.rows,
            })
        }else{
            return res.status(404).json({
                success : false,
                message : "students Not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Some internal server error..."
        })
    }
}

async function assingClassToStudent (req, res, next){
    try {
 
        let  { student_id, class_id} = req.body
console.log("assign class ", req.body)
        if(!student_id || !class_id){
            return res.status(400).json({
                success : false,
                message : "All fields are required...!"
            })
        }
        
       if(req.user.user_role == 'Admin'){

        let  checkedAssignClass = await studentModel.checkAssignClassOfStudent(req)
        let  checkData = checkedAssignClass?.rows[0]?.count || 0
        if(checkData == 0){
        let assignClassData = await studentModel.assignStudent(req);
         console.log("assignClassData", assignClassData.rowCount)
        if(assignClassData.rowCount > 0){
           
            return res.status(201).json({
                success : true,
                message : "Class is assigned successfully to the student ..",
                data : assignClassData.rows,
            })
        }else{
            return res.status(400).json({
                success : false,
                message : "Sorry, Unable to assign class to the student...!",
            })
        }
        
    }else{
        return res.status(400).json({
            success : false,
            message : "This class is already assigned to this student. ..!",
        }) 
    }
        }else{
            return res.status(401).json({
                success : false,
                message : "Sorry, You don't have access to assign class to the Student. ..!",
            })
        }
    
    } catch (error) {
        if (error.code === '23503') {
            // Foreign key violation
            return res.status(400).json({
                success: false,
                message: "Sorry, unable to assign class to the student. Foreign key error.",
            });
        } else {
            // Handle other errors
           // console.error("Unexpected error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error.",
            });
        }
    }
}

async function getClassmatesList (req, res, next){
    try {
        let student_id = req.query.student_id
        if(!student_id){
            return res.status(400).json({
                success : false,
                message : "student_id required...!"
            })
        }
       let studentData = await studentModel.getClassmates(req);
        if(studentData.rowCount>0){
            return res.status(200).json({
                success : false,
                message : "Classmates List!",
                data : studentData.rows,
            })
        }else{
            return res.status(404).json({
                success : false,
                message : "Classmates Not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Some internal server error..."
        })
    }
}
// student list which are part of all classes
async function getStudentsList (req, res, next){
    try {
        let school_id = req.query.school_id
        if(!school_id){
            return res.status(400).json({
                success : false,
                message : "school_id required...!"
            })
        }
       let studentData = await studentModel.getStudents(req);
        if(studentData.rowCount>0){
            return res.status(200).json({
                success : false,
                message : "Classes List!",
                data : studentData.rows,
            })
        }else{
            return res.status(404).json({
                success : false,
                message : "students Not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Some internal server error..."
        })
    }
}



module.exports = {createNewStudent, getAllStudent, assingClassToStudent, getStudentsList, getClassmatesList}