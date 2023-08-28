const db = require('./db');

const verificationDB = {
    verify: function (email, password, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection issue
                return callback(err, null);
            } else {
                const sqlStmt = "SELECT staff_id FROM staff WHERE email=? and password =? ";
                dbConn.query(sqlStmt, [email, password], (err, results) => {
                    if (err) {
                        return callback(err, null);
                    }else if (results.length === 0) {
                        const sqlStmt = "SELECT customer_id FROM customer WHERE email=? and password =? ";
                        dbConn.query(sqlStmt, [email, password], (err, results) => {
                            dbConn.end();
                            if(err) return callback(err, null);
                            else if (results.length === 0) return callback(null, null);
                            else return callback(null, {...results[0], role: 0});
                        })
                    } else {
                        dbConn.end();
                        const user = results[0];
                        return callback(null, {...user, role: 1});
                    }
                });
            }
        });
    }
}

module.exports = verificationDB;