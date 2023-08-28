// DAAA/FT/1B/04 2214506 Lim Zhen Yang
const db = require('./db');

const filmDB = {
    // Model for endpoint 6
    getFilmsByCategory : function(categoryId, offset, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                // 3 tables are joined together, film, film_category, and category
                const sqlStmt = 
                `
                    SELECT
                        film.film_id,
                        title,
                        description,
                        category,
                        rating,
                        release_year,
                        length AS duration
                    FROM
                        film,
                        film_category,
                        category
                    WHERE
                        film.film_id = film_category.film_id
                        AND film_category.category_id = category.category_id
                        AND film_category.category_id = ?
                    LIMIT 10 OFFSET ?
                `;  
                //Query db with sql statement
                dbConn.query(sqlStmt, [parseInt(categoryId), parseInt(offset)], (err, result) => {
                    const jsonAllString = JSON.stringify(result, (key, value) => value && typeof value === 'object' ? value : '' + value); // Converts all json values to string
                    dbConn.end(); // Close connection
                    if(err) return callback(err, null); // Return if error
                    return callback(null, JSON.parse(jsonAllString)); // Return result
                })
            }
        })
    },

    getRandomFilm : function(callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                // 3 tables are joined together, film, film_category, and category
                const sqlStmt = 
                `
                    SELECT
                        film_id,
                        title,
                        description,
                        release_year
                    FROM
                        film
                    ORDER BY RAND()
                    LIMIT 1;
                `;  
                //Query db with sql statement
                dbConn.query(sqlStmt, [], (err, result) => {
                    const jsonAllString = JSON.stringify(result, (key, value) => value && typeof value === 'object' ? value : '' + value); // Converts all json values to string
                    dbConn.end(); // Close connection
                    if(err) return callback(err, null); // Return if error
                    return callback(null, JSON.parse(jsonAllString)); // Return result
                })
            }
        })
    },

    searchFilms : function(title, category, maxPrice, offset, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                // 3 tables are joined together, film, film_category, and category
                let sqlStmt = 
                `
                    SELECT * FROM film, film_category, category
                    WHERE 
                        film.film_id = film_category.film_id
                    AND 
                        film_category.category_id = category.category_id
                `;  
                if(maxPrice) sqlStmt += ` AND film.rental_rate <= ${maxPrice}`
                if(title) sqlStmt += ` AND film.title LIKE '%${title}%'`
                if(category) sqlStmt += ` AND category.category LIKE '%${category}%'`
                if(offset) sqlStmt += ` LIMIT 30 OFFSET ${offset}`;
                //Query db with sql statement
                dbConn.query(sqlStmt, [], (err, result) => {
                    const jsonAllString = JSON.stringify(result, (key, value) => value && typeof value === 'object' ? value : '' + value); // Converts all json values to string
                    dbConn.end(); // Close connection
                    if(err) return callback(err, null); // Return if error
                    return callback(null, JSON.parse(jsonAllString)); // Return result
                })
            }
        })
    },

    getFilmById : function(filmId, callback){
        var dbConn = db.getConnection();
        dbConn.connect(err => {
            if(err) return callback(err, null);
            const sqlStmt = 
                `
                    SELECT
                        *
                    FROM film
                    LEFT JOIN film_category
                        ON film.film_id = film_category.film_id
                    LEFT JOIN category
                        ON film_category.category_id = category.category_id
                    LEFT JOIN language
                        ON film.language_id = language.language_id
                    LEFT JOIN film_actor
                        ON film.film_id = film_actor.film_id
                    LEFT JOIN actor
                        ON film_actor.actor_id = actor.actor_id
                    WHERE film.film_id = ?;
                `;  
            //Query db with sql statement
            dbConn.query(sqlStmt, [filmId], (err, result) => {
                const jsonAllString = JSON.stringify(result, (key, value) => value && typeof value === 'object' ? value : '' + value); // Converts all json values to string
                dbConn.end(); // Close connection
                if(err) return callback(err, null); // Return if error
                return callback(null, JSON.parse(jsonAllString)); // Return result
            })
        })
    },
    
    getCategories: function(callback){
        var dbConn = db.getConnection();
        dbConn.connect(err => {
            if(err) return callback(err, null);
            const sqlStmt = 'SELECT DISTINCT category FROM category;';
            //Query db with sql statement
            dbConn.query(sqlStmt, [], (err, result) => {
                const jsonAllString = JSON.stringify(result, (key, value) => value && typeof value === 'object' ? value : '' + value); // Converts all json values to string
                dbConn.end(); // Close connection
                if(err) return callback(err, null); // Return if error
                return callback(null, JSON.parse(jsonAllString)); // Return result
            })
        })
    }
}

module.exports = filmDB;