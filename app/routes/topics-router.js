const topicsRouter = require("express").Router()
const { getTopics } = require("../controllers/topics.controller")

topicsRouter.get("/topics", getTopics)

module.exports=topicsRouter
