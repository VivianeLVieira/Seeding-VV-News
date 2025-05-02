const express = require("express") 
const app = express();


const apiRouter = require("./routes/api-router")
const topicsRouter = require("./routes/topics-router")
const articlesRouter = require("./routes/articles-router")
const commentsRouter = require("./routes/comments-router")
const usersRouter = require("./routes/user-router")

app.use(express.json())

app.use("/api", apiRouter)

app.use("/api", topicsRouter)

app.use("/api", articlesRouter)

app.use("/api", commentsRouter)

app.use("/api", usersRouter)

app.all('/*splat', (req, res) => {
    res.status(404).send({msg: 'Path not found'})
})

app.use((err,req,res,next)=>{
    if(err.code === '22P02' || err.code === '42P02'){
        res.status(400).send({ msg:'Bad Request' })
    }
    else{
        next(err)
    }
})
app.use((err,req,res,next)=>{
    if(err.status && err.msg){
        res.status(err.status).send({ msg: err.msg })
    }
    else{
        next(err)
    }
})
app.use((err,req,res,next)=>{
    res.status(500).send({ msg:'Internal Server Error' })
})

module.exports = app