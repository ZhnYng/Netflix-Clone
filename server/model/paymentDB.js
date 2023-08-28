// DAAA/FT/1B/04 2214506 Lim Zhen Yang
const db = require('./db');

const paymentDB = {
    // Model for endpoint 7
    getPaymentByCustomer : function(customerId, start_date, end_date, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                // Joining these 4 tables, payment, rental, inventory, film
                const sqlStmt = 
                `
                    SELECT 
                        film.title, 
                        payment.amount, 
                        payment.payment_date
                    FROM
                        film, payment, rental, inventory
                    WHERE
                        payment.rental_id = rental.rental_id AND
                        rental.inventory_id = inventory.inventory_id AND
                        inventory.film_id = film.film_id AND
                        payment.customer_id = ? AND
                        payment_date BETWEEN ? and ?;
                `;
                //Query db with sql statement
                dbConn.query(sqlStmt, [customerId, start_date, end_date], (err, result) => {
                    dbConn.end(); // Close connection
                    if(err) return callback(err, null); // Return if error
                    let total = 0
                    for(const rental of result){
                        const amount = rental.amount;
                        total += amount;
                    }
                    return callback(null, {"rental":result, "total":`${Math.round(total * 100) / 100}`}); // Return result
                })
            }
        })
    },

    // Model for additional endpoint 2
    addPayment : function(paymentDetails, callback){
        var dbConn = db.getConnection();
        // Begin transaction
        dbConn.beginTransaction((err, result) => {
            if(err) return dbConn.rollback(() => callback(err, null)); // If error during transaction, rollback to prev database state and return err
            const {film_id, store_id, customer_id, return_date, staff_id} = paymentDetails
            if([film_id, store_id, customer_id, return_date, staff_id].includes(undefined)){
                return dbConn.rollback(() => callback("missing data", null)); // If theres missing data, rollback to prev database state and return err
            }
            // rental_date --> current timestamp which is retrieved with NOW()
            // inventory_id --> inventory_id of the film customer wants to order which is retrieved with SELECT inventory_id FROM inventory WHERE film_id = ? AND store_id = ? LIMIT 1
            const sqlStmt = 
            `
                INSERT INTO rental (rental_date, inventory_id, customer_id, return_date, staff_id)
                    VALUES(NOW(), (SELECT inventory_id FROM inventory WHERE film_id = ? AND store_id = ? LIMIT 1), ?, ?, ?);
            ` 
            dbConn.query(sqlStmt, [film_id, store_id, customer_id, return_date, staff_id], (err, result) => {
                if(err) return dbConn.rollback(() => callback(err, null)); // If error during transaction, rollback to prev database state and return err
                // rental_id --> most recent record of rental_id which is retrieved with SELECT MAX(rental_id) FROM rental
                // amount --> rental_rate of film which is retrieved with SELECT rental_rate FROM film WHERE film_id = ?
                // payment_date --> current timestamp which is retrieved with NOW()
                const sqlStmt = 
                `
                    INSERT INTO payment (customer_id, staff_id, rental_id, amount, payment_date)
                        VALUES(?, ?, (SELECT MAX(rental_id) FROM rental), (SELECT rental_rate FROM film WHERE film_id = ?), NOW());
                ` 
                dbConn.query(sqlStmt, [customer_id, staff_id, film_id], (err, result) => {
                    if(err) return dbConn.rollback(() => callback(err, null)); // If error during transaction, rollback to prev database state and return err
                    // Commit to the transaction
                    dbConn.commit((err, result) => {
                        if(err) return dbConn.rollback(() => callback(err, null)); // If error during transaction, rollback to prev database state and return err
                    })
                    return callback(null, result);
                })
            });
        });
    }
}

module.exports = paymentDB;