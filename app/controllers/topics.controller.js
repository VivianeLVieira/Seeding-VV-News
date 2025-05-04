const { selectTopics } = require("../models/topics.model"); 

exports.getTopics = (req, res, next) => {
    return selectTopics()
        .then((topics) => {
            if(topics.length === 0){
                return Promise.reject({ status: 404, msg: 'No topics found' })
            } else {
                res.status(200).send({ topics })
            }
        })
        .catch((err) => {
            next(err);
        })
}
