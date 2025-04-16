const db = require("./connection")


db.query('SELECT * FROM users').then((results) =>{
    console.log(results);
})
