const db = require("../../app/db/connection")

const selectArticles = (sort_by, order, topic) => {
    const sortOptions = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url', 'comment_count']
    const orderOptions = ['ASC', 'DESC']
    let queryArgs = []
    let query = `SELECT 
            articles.article_id, 
            articles.title,
            articles.topic,
            articles.author,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comment_id) ::INT AS comment_count 
        FROM articles LEFT JOIN comments 
            ON articles.article_id = comments.article_id`


    sort_by = sort_by || 'created_at' 
    order = order || 'DESC' 

    if (!orderOptions.includes(order.toUpperCase())) {
        return Promise.reject({ status: 400, msg: `It is not possible to order by ${order}` }) 
    }

    if (sortOptions.indexOf(sort_by.toLowerCase()) === -1 ) {
        return Promise.reject({ status: 400, msg: `It is not possible to sort by ${sort_by}` })
    }

    if (topic) {
        query += ` WHERE topic = $1`
        queryArgs.push(topic)
    } 

    query += ` GROUP BY articles.article_id`

    if (sort_by === 'comment_count'){
        console.log('entrou aqui')
        query += ` ORDER BY ${sort_by} ${order}`;
    } else {
        query += ` ORDER BY articles.${sort_by} ${order}`;
    }

    console.log(query)
    return db.query(query, queryArgs)
        .then(({ rows })=> rows )
}

const selectArticleById = (article_id) => {
    const query = `SELECT 
            articles.article_id, 
            title,
            topic,
            articles.author,
            articles.body,
            articles.created_at,
            articles.votes,
            article_img_url,
            COUNT(comment_id) ::INT AS comment_count 
        FROM articles LEFT JOIN comments 
            ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1 
        GROUP BY articles.article_id`

    if (!article_id ) {
        return Promise.reject({ status: 404, msg: 'article_id not provided' })
    } 

    return db.query(query, [article_id])
        .then(({ rows }) => rows[0])
}

const updateArticleById = ( article_id, inc_votes ) => {
    const query = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`

    if (!article_id || !inc_votes) {
        return Promise.reject({ status: 404, msg: 'article_id or inc_votes not provided' })
    } 

    return db.query(query, [inc_votes, article_id])
        .then(({rows}) => rows[0] )
}

const checkArticleExists = (article_id) => {
    return db
        .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
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


