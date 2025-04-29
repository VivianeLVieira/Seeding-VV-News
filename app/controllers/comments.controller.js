const { selectCommentsById, insertComment } = require("../models/comments.model"); 

exports.getCommentsById = (req, res, next) => {
    const { article_id } = req.params
    return selectCommentsById(article_id)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch((err)=>{
            next(err);
        })
}


exports.postCommentsByArticleId = (req, res, next) => {
    const { username, body } = req.body;
    const { article_id } = req.params;
    return insertComment( article_id, username, body)
        .then((newComment) => {
            res.status(201).send({ comment: newComment });
        })
        .catch((err)=>{
            console.log(err)
            next(err);
        })
}