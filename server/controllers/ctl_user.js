const dbHandlers = require('../db')

// Get user by ID
const getUserById = (req, res, next) => {
    if (req.params.idUser) {
        dbHandlers.Qgen_user.Qget_UserById(req.params.idUser, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).json({message: "Database error getting user by ID", err})
            }
            else if (results) {
                return res.json(results)
            }
            else {
                return res.status(404).send({message: "User not found"})
            }
        })
    }
    else {
        return res.status(400).send({message: "Bad request"})
    }
}

module.exports = {
    getUserById
}