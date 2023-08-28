const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");

var check = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({auth: false, message: "Insufficient privileges"});
    }
    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, (error, decodedToken) => {
        if (error) {
            return res.status(401).send({auth: false, message: "Try again"});
        }
        req.decodedToken = decodedToken;
        next();
    });
};

module.exports = check;