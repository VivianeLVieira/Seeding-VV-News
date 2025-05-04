const { selectUsers } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
    return selectUsers()
        .then((users) => {
            if (users.length === 0){
                return Promise.reject({ status: 404, msg: 'No users found' })
            } else {
                res.status(200).send({ users })
            }
        })
        .catch((err) => {
            next(err);
        })
}