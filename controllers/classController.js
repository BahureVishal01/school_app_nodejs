const classModel = require("../models/classModel");

async function createClass (req, res, next){
    try {
       let {class_name, school_id} = req.body;

       if(!class_name || !school_id){
        return res.status(400).json({
            success : false,
            message : "All fields are required...",
        })
       }
       if(req.user.user_role == 'Admin'){
        let classData = await classModel.createClass(req);
        if(classData.rowCount == 0){
            return res.status(400).json({
                success : false,
                message : "failed to create new class.",
            })
        }
        return res.status(201).json({
            success : true,
            message : "New class is created successfully.",
            data : classData.rows,
        })
        }else{
            return res.status(400).json({
                success : false,
                message : "Sorry, You don't have access to create new class. ..!",
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

async function getAllClass (req, res, next){
    try {
        let school_id = req.query.school_id
        if(!school_id){
            return res.status(400).json({
                success : false,
                message : "school_id required...!"
            })
        }

        let classData = await classModel.getAllClass(req);
        if(classData.rowCount>0){
            return res.status(200).json({
                success : false,
                message : "Classes List!",
                data : classData.rows,
            })
        }else{
            return res.status(404).json({
                success : false,
                message : "Classes Not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Some internal server error..."
        })
    }
}

module.exports = {createClass, getAllClass};