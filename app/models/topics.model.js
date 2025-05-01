const db = require("../../db/connection")

exports.selectTopics = () => {
    return db.query('SELECT slug, description FROM topics;')
        .then(({ rows })=> {
            if(rows.length === 0){
                return Promise.reject({ status: 404, msg: 'No topics found' })
            } else {
                return rows
            }
        })
}