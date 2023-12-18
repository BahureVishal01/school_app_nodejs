const {pool} = require("../db/db");

async function createClass(req){
    let insertQuery = `INSERT INTO classes (class_name, school_id) VALUES($1, $2) returning *`;
    let result = await pool.query(insertQuery, [req.body.class_name, req.body.school_id]);
    return result;
}

async function getAllClass(req){
    let insertQuery = `select * from classes where school_id=$1`;
    let result = await pool.query(insertQuery, [req.query.school_id]);
    return result;
}

module.exports = {createClass, getAllClass};