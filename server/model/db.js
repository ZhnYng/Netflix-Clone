// DAAA/FT/1B/04 2214506 Lim Zhen Yang
require('dotenv').config()
const mysql = require('mysql');

const db = {
    // Function to connect to bed_dvd_db
    getConnection : function(){
        const dbConn = mysql.createConnection({
            database : process.env.DATABASE,
            user : process.env.USER,
            password : process.env.PASSWORD,
            host : process.env.HOST,
            dateStrings : true,
            ssl: {"rejectUnauthorized":true}
        })
        return dbConn;
    }
}

module.exports = db;