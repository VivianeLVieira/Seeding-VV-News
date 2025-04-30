const { selectArticleById, selectArticles, updateArticleById} = require("../models/articles.model"); 

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    return selectArticleById(article_id)
        .then((article)=>{
            res.status(200).send({ article });
        })
        .catch((err)=>{
            next(err);
        })
}

exports.getArticles = (req, res, next) => {
    return selectArticles()
        .then((articles) => {
            res.status(200).send({ articles })
        })
        .catch((err) => {
            next(err);
        })
}

exports.patchArticleById = (req, res, next) => {
    const { inc_votes } = req.body;
    const { article_id } = req.params;
    return updateArticleById( article_id, inc_votes)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err)=>{
            next(err);
        })
}


