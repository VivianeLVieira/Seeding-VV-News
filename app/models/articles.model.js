const db = require("../../db/connection")

const selectArticleById = (article_id) => {
    return db.query(
        `SELECT 
            author,
            title,
            article_id,
            body,
            topic,
            created_at,
            votes,
            article_img_url
        FROM articles
        WHERE article_id = $1;`,
        [article_id]
    ).then(({ rows }) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: 'No article found' })
        } else {
            return rows
        }
    })
}

const selectArticles = () => {
    const query = `SELECT 
            articles.article_id, 
            title,
            topic,
            articles.author,
            articles.created_at,
            articles.votes,
            article_img_url,
            COUNT(comment_id) as comment_count
        FROM articles LEFT JOIN comments 
            ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`

    return db.query(query)
        .then(({ rows })=> {
            if(rows.length === 0){
                return Promise.reject({ status: 404, msg: 'No articles found' })
            } else {
                return rows
            }
        })
}

const updateArticleById = ( article_id, inc_votes ) => {
    const promiseArr = []
    let queryArgs = []
    let queryStr = `UPDATE articles SET votes = votes + $1 `

    if (article_id && inc_votes) {
        queryStr += ` WHERE article_id = $2`
        promiseArr.push(checkArticleExists(article_id))
        queryArgs.push(inc_votes, article_id)
    } 

    queryStr += ` RETURNING *`
    promiseArr.unshift(db.query(queryStr, queryArgs))

    return Promise.all(promiseArr).then((results)=> {
        const queryPromise = results[0]
        return queryPromise.rows[0];
    })
}

const checkArticleExists = (article_id) => {
    return db
        .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
        .then(({ rows }) => {
            if(rows.length === 0){
                return Promise.reject({ status: 404, msg: 'No article found' })
            } else {
                return rows
            }
        })
}

module.exports = { 
    selectArticleById,
    selectArticles,
    updateArticleById,
    checkArticleExists
}


