// DAAA/FT/1B/04 2214506 Lim Zhen Yang
const express = require('express');
const actorDB = require('../model/actorDB');
const filmDB = require('../model/filmDB');
const customerDB = require('../model/customerDB');
const verificationDB = require('../model/verificationDB');
const basketDB = require('../model/basketDB');
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");
const isLoggedInMiddleware = require('../auth/isLoggedInMiddleware');
const cors = require('cors');
const ratingDB = require('../model/ratingDB');
const storeDB = require('../model/storeDB');
const { body, validationResult, query } = require('express-validator');

const app = express();
app.use(express.json()); // Middleware to parse incoming requests with JSON payloads
app.use(cors({
    origin: "https://bednetflixclone.netlify.app"
}))

app.post("/actors", isLoggedInMiddleware, (req, res) => {
    // Check that user is admin
    if(req.decodedToken.role === 1){
        if (req.body.first_name && req.body.last_name) {
            actorDB.addActor(req.body, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({ "message": "Internal server err" });
                } else {
                    res.status(201).send({ "message": `Actor inserted at ${result.insertId}` });
                }
            })
        } else {
            res.status(400).send({ "message": "missing data" }); // Mising params in req.body
        }
    }else{
        res.status(401).send({auth: false, message: "Insufficient privileges"});
    }
})

//Endpoint 6
app.get("/film_categories/:category_id/films", (req, res) => {
    filmDB.getFilmsByCategory(req.params.category_id, req.query.offset, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ "message": "Internal server err" });
        } else {
            res.status(200).send(result);
        }
    })
})

app.get("/randomFilm", (req, res) => {
    filmDB.getRandomFilm((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ "err_msg": "Internal server err" });
        } else {
            res.status(200).send(result);
        }
    })
})

app.get(
    "/search_films",
    query(["title", "category"]).isAlpha('en-US', {ignore: ' '}).optional({checkFalsy: true}), //Checks if alphabetical, ignoring whitespace and empty values
    query(["maxPrice", "offset"]).isNumeric().optional({checkFalsy: true}), // Checks if numerical, ignores empty value
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        filmDB.searchFilms(req.query.title, req.query.category, req.query.maxPrice, req.query.offset, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ "err_msg": "Internal server err" });
            } else {
                res.status(200).send(result);
            }
        })
})

app.get('/categoryNames', (req, res) => {
    filmDB.getCategories((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ "err_msg": "Internal server err" });
        } else {
            res.status(200).send(result);
        }
    });
})

app.get("/film", (req, res) => {
    filmDB.getFilmById(req.query.filmId, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ "err_msg": "Internal server err" });
        }else{
            res.status(200).send(result);
        }
    })
})

app.post(
    '/rating', 
    body('review').isLength({max: 255}), // Checks if max length of the review is exceeded before querying
    isLoggedInMiddleware,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ 'message': 'Review is Too long' });
        }
        if(req.decodedToken.role !== 1){ // Admins are not allowed to leave a review
            ratingDB.addRating(req.body, req.decodedToken.user_id, (err, result) => {
                if(err?.code === 'ER_DUP_ENTRY'){
                    res.status(409).send({"message": "Duplicate entry"})
                }else if(err){
                    console.log(err);
                    res.status(500).send({ "message": "Internal server err" });
                }else{
                    res.status(201).send()
                }
            })
        }else{
            res.status(403).send({"message": "Forbidden"})
        }
})

app.get('/rating', (req, res) => {
    ratingDB.getRating(req.query.filmId, req.query.offset, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ "message": "Internal server err" });
        }else{
            res.status(200).send(result);
        }
    })
})

app.get('/overallRating', (req, res) => {
    ratingDB.getOverallRating(req.query.filmId, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ "message": "Internal server err" });
        }else{
            res.status(200).send(result);
        }
    })
})

//Endpoint 8
app.post("/customers", isLoggedInMiddleware, (req, res) => {
    if(req.decodedToken.role === 1){ // Check if is admin
        customerDB.addCustomer(req.body, (err, result) => {
            if (err === 'missing data') {
                res.status(400).send({ "message": err });
            } else if (err?.code === "ER_DUP_ENTRY") {
                res.status(409).send({ "message": "Email already exists" })
            } else if (err) {
                console.log(err);
                res.status(500).send({ "message": "Internal server err" });
            } else {
                res.status(201).send({"message": "Account created"});
            }
        })
    }else{
        res.status(401).send({auth: false, message: "Insufficient privileges"});
    }
})

//Additional Endpoint 1
app.put(
    '/customers/update', 
    query("customer_id").isNumeric(),
    isLoggedInMiddleware,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ 'message': 'Customer_id unspecified' });
        }
        if(req.decodedToken.role === 1){
            customerDB.updateCustomer(req.body, req.query.customer_id, (err, result) => {
                if(err === "missing data"){
                    res.status(400).send({"message": err});
                }else if(err?.code === "ER_DUP_ENTRY"){ // If user tries to update their email with an existing email, this error occurs
                    res.status(409).send({"message": "email already exist"});
                }else if(err){
                    console.log(err);
                    res.status(500).send({"message": "Internal server error"});
                }else if(result.affectedRows === 0){ // No rows updated as customer_id is unknown
                    res.status(204).send();
                }else{
                    res.status(200).send({"message": "record updated"});
                }
            })
        }else{
            res.status(401).send({auth: false, message: "Insufficient privileges"});
        }
    }
)

app.get('/customer', isLoggedInMiddleware, (req, res) => {
    // Checks if logged in user is a customer
    if(req.decodedToken.role === 0){
        customerDB.getCustomer(req.decodedToken.user_id, (err, result) => {
            if(err){
                console.log(err);
                res.status(500).send({ "message": "Internal server err" });
            }else{
                res.status(200).send(result);
            }
        })
    }else{
        res.status(401).send({"message": "Insufficient privileges"})
    }
})

app.post("/login", (req, res) => {
    verificationDB.verify(req.body.email, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.status(500).send({ "error_msg": "Internal server err" });
            return;
        }else if (user === null) {
            res.status(401).send({"error_msg":"Email or Password is wrong"});
            return;
        }else{
            let payload;
            user.staff_id ?
                payload = { user_id: user.staff_id, role: user.role } :
                payload = { user_id: user.customer_id, role: user.role };
            jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: "5h" }, (err, token) => {
                if (err) {
                    console.log(err);
                    res.status(401).send({"error_msg":"Try Again"});
                    return;
                }
                res.status(200).send({
                    token: token,
                    user_id: payload.user_id,
                    role: user.role
                });
            })
        }
    });
});

app.post("/verifyToken", isLoggedInMiddleware, (req, res) => {
    if(req.decodedToken){
        res.status(200).send({"decodedToken": req.decodedToken});
    }
})

app.get('/basket', isLoggedInMiddleware, (req, res) => {
    basketDB.getSavedFilms(req.decodedToken.user_id, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ "message": "Internal server err" });
        }else{
            res.status(200).send(result);
        }
    })
})

app.post('/saveFilm', isLoggedInMiddleware, (req, res) => {
    basketDB.saveFilm(req.decodedToken.user_id, req.body, (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({ "message": "Internal server err" });
        }else{
            res.status(201).send(result);
        }
    })
})

app.delete('/unsaveFilm', isLoggedInMiddleware, (req, res) => {
    basketDB.unsaveFilm(req.decodedToken.user_id, req.body, (err,result) => {
        if(err){
            console.log(err);
            res.status(500).send({ "message": "Internal server err" });
        }else if(result.affectedRows == 0) {
            res.status(204).send();
        }else{
            res.status(200).send({ "message": "deleted" });
        }
    })
})

app.get('/storeAddress', (req, res) => {
    storeDB.getStoreAddress((err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ "message": "Internal server err" });
        }else{
            res.status(200).send(result);
        }
    })
})

module.exports = app;