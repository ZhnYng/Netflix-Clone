// DAAA/FT/1B/04 2214506 Lim Zhen Yang
const db = require('./db');

const ratingDB = {
    // Model for endpoint 8
    getStoreAddress : function(callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                const sqlStmt = 
                `
                    SELECT store_id, address FROM
                    store, address
                    WHERE store.address_id = address.address_id
                `; 
                // Insert new address into address table
                dbConn.query(sqlStmt, [], (err, result) => {
                    dbConn.end();
                    if(err) return callback(err, null); // Return if error
                    return callback(null, result);
                })
            }
        })
    }
}

module.exports = ratingDB;