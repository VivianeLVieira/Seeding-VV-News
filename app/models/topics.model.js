const { promises } = require("supertest/lib/test")
const db = require("../../db/connection")

exports.selectTopics = () => {
    //console.log("entered topics")
    return db.query('SELECT slug, description FROM topics;')
        .then(({ rows })=> {
            if(rows.length === 0){
                return Promise.reject({ status: 404, msg: 'No topics found' })
            } else {
                return rows
            }
        })
}