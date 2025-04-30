const db = require("../../db/connection")
const { checkArticleExists } = require("./articles.model")
const { checkUserExists } = require("./users.model")

const selectCommentsById = (article_id) => {
    const promiseArr = []
    let queryArgs = []
    let queryStr = `SELECT comment_id, article_id, body, votes, author, created_at FROM comments`

    if (article_id){
        queryStr += ` WHERE article_id = $1`;
        queryArgs.push(article_id);
        promiseArr.push(checkArticleExists(article_id))
    }

    queryStr += ` ORDER BY comments.created_at DESC`

    promiseArr.unshift(db.query(queryStr, queryArgs))

    return Promise.all(promiseArr).then((results)=>{
        const queryPromise = results[0]

        if(queryPromise.rows.length === 0){
            return Promise.reject({ status: 404, msg: 'No comments found' })
        } else {
            return queryPromise.rows;
        }
    })
}

const insertComment = ( article_id, username, body ) => {
    const promiseArr = []
    let queryArgs = []
    let queryStr = `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`

    if (article_id && username && body) {
        promiseArr.push(checkArticleExists(article_id))
        promiseArr.push(checkUserExists(username))
        queryArgs.push(article_id, username, body)
    } 
    
    promiseArr.unshift(db.query(queryStr, queryArgs))

    return Promise.all(promiseArr).then((results)=> {
        const queryPromise = results[0]
        return queryPromise.rows[0];
    })
}

const deleteCommentByCommentId = (comment_id) => {
    const promiseArr = []
    let queryArgs = []
    let queryStr = `DELETE FROM comments WHERE comment_id = $1`

    if (comment_id) {
        promiseArr.push(checkCommentExists(comment_id))
        queryArgs.push(comment_id)
    } 

    promiseArr.unshift(db.query(queryStr, queryArgs))

    return Promise.all(promiseArr).then((results)=> {
        const queryPromise = results[0]
        return queryPromise.rows;
    })
}

const checkCommentExists = (comment_id) => {
    return db
        .query('SELECT * FROM comments WHERE comment_id = $1', [comment_id])
        .then(({ rows }) => {
            if(rows.length === 0){
                return Promise.reject({ status: 404, msg: 'No comment found' })
            } else {
                return rows
            }
        })
}

module.exports = { selectCommentsById, insertComment, checkCommentExists, deleteCommentByCommentId }