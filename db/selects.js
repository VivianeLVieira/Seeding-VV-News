const db = require("./connection")


function getAllUsers(){ // Get all of the users
    db.query('SELECT * FROM users;').then((results) =>{ 
        console.log(results);
    })
}
//getAllUsers();


/* //Get all of the articles where the topic is coding
db.query(`SELECT * FROM articles WHERE articles.topic = 'coding';`).then((results) =>{
    console.log(results);
})
*/

/*//Get all of the comments where the votes are less than zero
db.query(`SELECT * FROM comments WHERE votes < 0;`).then((results) =>{
    console.log(results);
})
*/

/*//Get all of the topics
db.query(`SELECT * FROM topics;`).then((results) =>{
    console.log(results);
})
*/    

/*//Get all of the articles by user grumpy19
db.query(`SELECT * FROM articles WHERE author = 'grumpy19';`).then((results) =>{
    console.log(results);
})
*/

/*
//Get all of the comments that have more than 10 votes
db.query(`SELECT * FROM comments WHERE votes > 10;`).then((results) =>{
    console.log(results);
})
*/
