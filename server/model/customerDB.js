// DAAA/FT/1B/04 2214506 Lim Zhen Yang
const db = require('./db');

const customerDB = {
    // Model for endpoint 8
    addCustomer : function(customerDetails, callback){
        var dbConn = db.getConnection();
        // Try connecting to database
        dbConn.connect((err, result) => {
            if(err) return callback(err, null); // Returns if connection failed
            else{
                const address = customerDetails.address; // Isolate address attribute
                const {
                    address_line1,
                    address_line2,
                    district,
                    city_id,
                    postal_code,
                    phone
                } = address
                // Check if any values in address are undefined
                if([address_line1, district, city_id, postal_code, phone].indexOf('') !== -1){
                    return callback("missing data", null);
                }
                const sqlStmt = 
                `
                    INSERT INTO address (
                        address,
                        address2,
                        district,
                        city_id,
                        postal_code,
                        phone
                    ) VALUES (?, ?, ?, ?, ?, ?);
                `; 
                // Insert new address into address table
                dbConn.query(sqlStmt, [address_line1, address_line2, district, city_id, postal_code, phone], (err, result) => {
                    if(err) return callback(err, null); // Return if error

                    const insertId = result.insertId;
                    const {store_id, first_name, last_name, email, password} = customerDetails;
                    // Checks for undefined values
                    if([store_id, first_name, last_name, email, password].indexOf('') !== -1){
                        return callback("missing data", null);
                    }
                    // The use of a sub query to get the last address_id, which is the address that was just added earlier
                    const sqlStmt = 
                    `
                        INSERT INTO customer (
                            store_id,
                            first_name,
                            last_name,
                            email,
                            address_id,
                            password
                        ) VALUES (?, ?, ?, ?, ?, ?);
                    `; 
                    // Insert new customer 
                    dbConn.query(sqlStmt, [store_id, first_name, last_name, email, insertId, password], (err, result) => {
                        if(err) return callback(err, null); // Return if error
                        
                        const sqlStmt = "SELECT customer_id FROM customer ORDER BY customer_id DESC LIMIT 1;";
                        // Get the id of the new row
                        dbConn.query(sqlStmt, [], (err, result) => {
                            dbConn.end(); // Close connection
                            if(err) return callback(err, null);
                            return callback(null, {customer_id: `${result[0].customer_id}`, role: 0});
                        })
                    })
                })
            }
        })
    },

    // Model for additional endpoint 1
    updateCustomer: function(customerDetails, customerId, callback){
        var dbConn = db.getConnection(); 
        dbConn.connect((err, result) => {
            if(err) return callback(err, null);
            const {address, ...otherDetails} = customerDetails; // Separate address details from customer details (otherDetails contains customer details excluding address)
            let sqlStmt = "UPDATE customer SET ";
            const acceptedParams = [ // Array of acceptable keys to be in otherDetails object
                "store_id",
                "first_name",
                "last_name",
                "email",
                "address_id",
                "password"
            ]
            for(const key of Object.keys(otherDetails)){ // Loops through all keys of otherDetails
                if(acceptedParams.includes(key)){ // Checks if key is part of the acceptedParams
                    sqlStmt += `${key} = ?`; 
                }else{
                    delete otherDetails[key]; // Remove redundant keys that are not supposed to be in otherDetails
                }
                Object.keys(otherDetails).indexOf(key) === Object.keys(otherDetails).length-1 ? sqlStmt += ' ' : sqlStmt += ', '; // If currentkey is the last key, concatenate a " " else concatenate a ", "
            }
            // No valid data in req.body, thus return missing data
            if(sqlStmt === "UPDATE customer SET " && address === undefined){
                return callback("missing data", null);
            }
            sqlStmt += "WHERE customer_id = ?;";
            dbConn.query(sqlStmt, [...Object.values(otherDetails), parseInt(customerId)], (err, result) => { 
                if(err) return callback(err, null);

                const insertId = result.insertId;
                if(!address){ // If no updates to address, end query, return result
                    dbConn.end();
                    return callback(null, result);
                }else{
                    let sqlStmt = "UPDATE address SET ";
                    const acceptedParams = [ // Array of acceptable keys to be in address object
                        "address",
                        "address2",
                        "district",
                        "city_id",
                        "postal_code",
                        "phone"
                    ]
                    for(const key of Object.keys(address)){ // Loops through all keys of address
                        if(acceptedParams.includes(key)){ // Checks if key is part of the acceptedParams
                            sqlStmt += `${key} = ?`;
                        }else{
                            delete address[key]; // Remove redundant keys that are not supposed to be in address
                        }
                        Object.keys(address).indexOf(key) === Object.keys(address).length-1 ? sqlStmt += ' ' : sqlStmt += ', '; // If currentkey is the last key, concatenate a " " else concatenate a ", "
                    }
                    // No valid data in req.body, thus return missing data
                    if(sqlStmt === "UPDATE address SET "){
                        return callback("missing data", null);
                    }
                    // The use of an inner query to get the address_id from the customer table
                    sqlStmt += "WHERE address_id = (SELECT address_id FROM customer WHERE customer_id = ?);";
                    dbConn.query(sqlStmt, [...Object.values(address), parseInt(customerId)], (err, result) => {
                        dbConn.end();
                        if(err) return callback(err, null);
                        return callback(null, result);
                    })
                }
            });
        })
    },

    getCustomer: function(customer_id, callback){
        var dbConn = db.getConnection();
        dbConn.connect((err, result) => {
            if(err) return callback(err, null);
            const sqlStmt = `
                SELECT store_id, first_name, last_name, 
                    email, address, address2, district, city, 
                    postal_code, phone, country
                FROM
                    customer, address, city, country
                WHERE 
                    address.city_id = city.city_id
                AND
                    customer.address_id = address.address_id
                AND
                    city.country_id = country.country_id
                AND
                    customer.customer_id = ?;
            `
            dbConn.query(sqlStmt, [customer_id], (err, result) => {
                dbConn.end();
                if(err) return callback(err, null);
                return callback(null, result);
            })
        })
    }
}

module.exports = customerDB;