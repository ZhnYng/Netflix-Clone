// DAAA/FT/1B/04 2214506 Lim Zhen Yang
const db = require('./db');

const basketDB = {
    // Model for endpoint 1
    getSavedFilms : function(customer_id, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                // Queries for columns actor_id, first_name, and last_name from actor table by actor_id
                const sqlStmt = "SELECT basket.basket_id, film.film_id, film.title, film.description, film.release_year FROM film, basket WHERE basket.film_id = film.film_id and basket.customer_id = ?;" 
                // Query db with sql statement
                dbConn.query(sqlStmt, [customer_id], (err, result) => {
                    const jsonAllString = JSON.stringify(result, (key, value) => value && typeof value === 'object' ? value : '' + value); // Converts all json values to string
                    dbConn.end(); // Close connection
                    if(err) return callback(err, null); // Return if error
                    return callback(null, JSON.parse(jsonAllString)); // Return result
                })
            }
        })
    },

    // Model for endpoint 3
    saveFilm : function(customer_id, filmDetails, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                const {film_id} = filmDetails;
                // Inserts a new record into actor
                const sqlStmt = "INSERT INTO basket (customer_id, film_id) VALUES (?, ?);"; 
                //Query db with sql statement
                dbConn.query(sqlStmt, [customer_id, film_id], (err, result) => {
                    const jsonAllString = JSON.stringify(result, (key, value) => value && typeof value === 'object' ? value : '' + value); // Converts all json values to string
                    dbConn.end(); // Close connection
                    if(err) return callback(err, null); // Return if error
                    return callback(null, JSON.parse(jsonAllString)); // Return result
                })
            }
        })
    },

    // Model for endpoint 5
    unsaveFilm : function(customer_id, filmDetails, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                const {film_id} = filmDetails;
                const sqlStmt = "DELETE FROM basket WHERE customer_id = ? and film_id = ?;";
                //Query db with sql statement
                dbConn.query(sqlStmt, [customer_id, film_id], (err, result) => {
                    if(err) return callback(err, null); // Return if error
                    return callback(null, result);
                })
            }
        })
    }
}

module.exports = basketDB;