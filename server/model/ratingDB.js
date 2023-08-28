// DAAA/FT/1B/04 2214506 Lim Zhen Yang
const db = require('./db');

const ratingDB = {
    // Model for endpoint 8
    addRating : function(ratingDetails, customer_id, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                const {film_id, stars, review} = ratingDetails
                const sqlStmt = 
                `
                    INSERT INTO rating (
                        film_id,
                        customer_id,
                        stars,
                        reviews
                    ) VALUES (?, ?, ?, ?);
                `; 
                // Insert new address into address table
                dbConn.query(sqlStmt, [film_id, customer_id, stars, review], (err, result) => {
                    dbConn.end();
                    if(err) return callback(err, null); // Return if error
                    return callback(null, result);
                })
            }
        })
    },
    
    getRating : function(filmId, offset, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                const sqlStmt = 
                `
                    SELECT customer.email, stars, reviews
                    FROM customer, rating
                    WHERE 
                        customer.customer_id = rating.customer_id
                    AND
                        film_id = ?
                    LIMIT 2 OFFSET ?;
                `; 
                // Insert new address into address table
                dbConn.query(sqlStmt, [filmId, parseInt(offset)], (err, result) => {
                    dbConn.end();
                    if(err) return callback(err, null); // Return if error
                    return callback(null, result);
                })
            }
        })
    },

    getOverallRating: function(filmId, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                const sqlStmt = 
                `
                    SELECT AVG(stars)
                    FROM rating
                    WHERE film_id = ?
                `; 
                // Insert new address into address table
                dbConn.query(sqlStmt, [filmId], (err, result) => {
                    dbConn.end();
                    if(err) return callback(err, null); // Return if error
                    return callback(null, result);
                })
            }
        }) 
    }
}

module.exports = ratingDB;