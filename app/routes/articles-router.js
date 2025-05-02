const articlesRouter = require("express").Router()
const { getArticleById, getArticles, patchArticleById } = require("../controllers/articles.controller")
const { getCommentsByArticleId, postCommentsByArticleId } = require("../controllers/comments.controller")

articlesRouter.get("/articles", getArticles)

articlesRouter.get("/articles/:article_id", getArticleById)

articlesRouter.get("/articles/:article_id/comments", getCommentsByArticleId)

articlesRouter.post("/articles/:article_id/comments", postCommentsByArticleId)

articlesRouter.patch("/articles/:article_id", patchArticleById)


module.exports=articlesRouter
