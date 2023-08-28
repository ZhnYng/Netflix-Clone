// DAAA/FT/1B/04 2214506 Lim Zhen Yang
const db = require('./db');

const actorDB = {
    // Model for endpoint 1
    getActorById : function(actor_id, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                // Queries for columns actor_id, first_name, and last_name from actor table by actor_id
                const sqlStmt = "SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?;" 
                // Query db with sql statement
                dbConn.query(sqlStmt, [actor_id], (err, result) => {
                    const jsonAllString = JSON.stringify(result, (key, value) => value && typeof value === 'object' ? value : '' + value); // Converts all json values to string
                    dbConn.end(); // Close connection
                    if(err) return callback(err, null); // Return if error
                    return callback(null, JSON.parse(jsonAllString)); // Return result
                })
            }
        })
    },
    
    // Model for endpoint 2
    getActors : function(limit=20, offset=0, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                // Queries for columns actor_id, first_name, and last_name from actor table ordered by first_name
                const sqlStmt = "SELECT actor_id, first_name, last_name FROM actor ORDER BY first_name LIMIT ? OFFSET ?;"
                // Query db with sql statement
                dbConn.query(sqlStmt, [parseInt(limit), parseInt(offset)], (err, result) => {
                    const jsonAllString = JSON.stringify(result, (key, value) => value && typeof value === 'object' ? value : '' + value); // Converts all json values to string
                    dbConn.end(); // Close connection
                    if(err) return callback(err, null); // Return if error
                    return callback(null, JSON.parse(jsonAllString)); // Return result
                })
            }
        })
    },

    // Model for endpoint 3
    addActor : function(actorDetails, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                // Inserts a new record into actor
                const sqlStmt = "INSERT INTO actor (first_name, last_name) VALUES (?, ?);"; 
                //Query db with sql statement
                dbConn.query(sqlStmt, [actorDetails.first_name, actorDetails.last_name], (err, result) => {
                    const jsonAllString = JSON.stringify(result, (key, value) => value && typeof value === 'object' ? value : '' + value); // Converts all json values to string
                    dbConn.end(); // Close connection
                    if(err) return callback(err, null); // Return if error
                    return callback(null, JSON.parse(jsonAllString)); // Return result
                })
            }
        })
    },

    // Model for endpoint 4
    updateName : function(actorId, actorDetails, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                let sqlStmt = '';
                const acceptedParams = ['first_name', 'last_name'];
                sqlStmt += "UPDATE actor SET ";
                /* 
                The loop below does the following:
                1. Checks if keys of actorDetails is required in the request
                2. If it is, construct the sql statement, so that the field will be updated
                3. Delete unnecessary key value pairs in actorDetails
                */
                for(const key of Object.keys(actorDetails)){
                    if(acceptedParams.includes(key)){
                        sqlStmt += `${key} = ?`;
                        if(Object.keys(actorDetails).indexOf(key) == Object.keys(actorDetails).length-1){
                            sqlStmt += ' ';
                        }else{
                            sqlStmt += ', ';
                        }
                    }else{
                        delete actorDetails[key];
                    }
                }
                if(Object.keys(actorDetails).length > 0){ // If request is valid, execute the query
                    sqlStmt += "WHERE actor_id = ?;";
                    //Query db with sql statement
                    dbConn.query(sqlStmt, [...Object.values(actorDetails), actorId], (err, result) => {
                        dbConn.end(); // Close connection
                        if(err) return callback(err, null); // Return if error
                        return callback(null, result); // Return result
                    })
                }else{
                    return callback("missing data", null);
                }
            }
        })
    },

    // Model for endpoint 5
    removeActor : function(actorId, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                const sqlStmt = "DELETE FROM film_actor WHERE film_actor.actor_id = ?;";
                //Query db with sql statement
                dbConn.query(sqlStmt, [actorId], (err, result) => {
                    if(err) return callback(err, null); // Return if error
                
                    const sqlStmt = "DELETE FROM actor WHERE actor.actor_id = ?;";
                    dbConn.query(sqlStmt, [parseInt(actorId)], (err, result) => {
                        dbConn.end();
                        if(err) return callback(err, null);
                        return callback(null, result);
                    })
                })
            }
        })
    }
}

module.exports = actorDB;