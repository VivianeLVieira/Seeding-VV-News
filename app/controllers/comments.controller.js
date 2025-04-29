const { selectCommentsById } = require("../models/comments.model"); 

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