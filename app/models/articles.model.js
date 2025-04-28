const db = require("../../db/connection")

exports.selectArticleById = (article_id) => {
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

exports.selectArticles = () => {
    console.log("entered model")
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
            console.log(rows)
            if(rows.length === 0){
                return Promise.reject({ status: 404, msg: 'No articles found' })
            } else {
                return rows
            }
        })
}