exports.handleUnknownPath = (req, res) => {
    res.status(404).send({msg: 'Path not found'})
};

exports.handleDatabaseErrors = (err, req, res, next) => {
    if (err.code === '22P02' || err.code === '42P02') {
        res.status(400).send({ msg:'Bad Request' })
    } else {
        next(err)
    }
};

exports.handleApplicationErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else{
        next(err)
    }
};

exports.handleGenericErrors = (err, req, res, next) => {
    res.status(500).send({ msg:'Internal Server Error' })
};
