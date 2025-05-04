const db = require("../../app/db/connection")

const selectCommentsById = (article_id) => {
    const query = `
        SELECT comment_id, article_id, body, votes, author, created_at 
        FROM comments
        WHERE article_id = $1
        ORDER BY comments.created_at DESC
    `
    if (!article_id){
        return Promise.reject({ status: 404, msg: 'article_id not provided' })
    }
    return db.query(query, [article_id])
        .then(({ rows }) => rows )
}

const insertComment = ( article_id, username, body ) => {
    const query = `INSERT INTO comments (article_id, author, body) 
        VALUES ($1, $2, $3) RETURNING *`
    
    if (!article_id || !username || !body){
        return Promise.reject({ status: 404, msg: ' article_id or username or body not provided' })
    }

    return db.query(query, [article_id, username, body])
        .then(({rows}) => rows[0])
}

const deleteCommentByCommentId = (comment_id) => {
    let query = `DELETE FROM comments WHERE comment_id = $1`

    if (!comment_id){
        return Promise.reject({ status: 404, msg: 'comment_id not provided' })
    }

    return db.query(query, [comment_id])
        .then(({ rows }) => rows )
}

const checkCommentExists = (comment_id) => {
    if (!comment_id){
        return Promise.reject({ status: 404, msg: 'comment_id not provided' })
    }

    return db
        .query('SELECT * FROM comments WHERE comment_id = $1', [comment_id])
        .then(({ rows }) => {
            if(rows.length === 0){
                return Promise.reject({ status: 404, msg: 'No comment found' })
            } 
            return rows
        })
}

module.exports = { selectCommentsById, insertComment, checkCommentExists, deleteCommentByCommentId }