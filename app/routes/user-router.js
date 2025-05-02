const usersRouter = require("express").Router()
const { getUsers } = require("../controllers/users.controller")

usersRouter.get("/users", getUsers)

module.exports=usersRouter
