// DAAA/FT/1B/04 2214506 Lim Zhen Yang
const app = require('./control/app');

// Backend running at localhost:5000
app.listen(5000, (err) => {
    if(err) throw err;
    console.log("Server running on port 5000");
})