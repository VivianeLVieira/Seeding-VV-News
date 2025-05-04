const { selectCommentsById, insertComment, deleteCommentByCommentId, checkCommentExists} = require("../models/comments.model"); 
const { checkArticleExists } = require("../models/articles.model")
const { checkUserExists } = require("../models/users.model")

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    return checkArticleExists(article_id)
        .then(() => selectCommentsById(article_id))
        .then((comments) => {
            if (comments.length === 0){
                return Promise.reject({ status: 404, msg: 'No comments found' })
            }
            res.status(200).send({ comments });
        })
        .catch((err)=>{
            next(err);
        }) 
}

exports.postCommentsByArticleId = (req, res, next) => {
    const { username, body } = req.body;
    const { article_id } = req.params;

    if (!username || !body) {
        return res.status(400).send({ msg: "Bad Request" });
    }

    return Promise.all([
            checkArticleExists(article_id),
            checkUserExists(username)
        ])
        .then(() => insertComment( article_id, username, body))
        .then((newComment) => {
            res.status(201).send({ comment: newComment });
        })
        .catch((err)=>{
            next(err);
        })
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    return checkCommentExists(comment_id)
        .then(() => deleteCommentByCommentId(comment_id))
        .then((result) => {
            res.status(204).send();
        })
        .catch((err)=>{
            next(err);
        })
}