const express = require("express") 
const apiRouter = require("./routes/api-router")
const topicsRouter = require("./routes/topics-router")
const articlesRouter = require("./routes/articles-router")
const commentsRouter = require("./routes/comments-router")
const usersRouter = require("./routes/user-router")
const { handleUnknownPath, handleDatabaseErrors, handleApplicationErrors, handleGenericErrors } = require("./middlewares/error-handlers")

const app = express();

app.use(express.json())

app.use("/api", apiRouter)

app.use("/api", topicsRouter)

app.use("/api", articlesRouter)

app.use("/api", commentsRouter)

app.use("/api", usersRouter)

app.all('/*splat', handleUnknownPath)

app.use(handleDatabaseErrors)
app.use(handleApplicationErrors)
app.use(handleGenericErrors)

module.exports = app