const db = require("../../app/db/connection")

const selectUsers = () => {
    const query = `SELECT * FROM users`

    return db.query(query)
        .then(({ rows })=> {
            return rows
        })
}

const checkUserExists = (username) => {
    return db
        .query('SELECT * FROM users WHERE username = $1', [username])
        .then(({ rows }) => {
            if(rows.length === 0){
                return Promise.reject({ status: 404, msg: 'No user found' })
            } 
            return rows
        })
}

module.exports = { checkUserExists, selectUsers }