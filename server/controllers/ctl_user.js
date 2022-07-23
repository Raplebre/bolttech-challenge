const dbHandlers = require('../db')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../config.json')

// Get user by ID
const getUserById = (req, res, next) => {
    if (req.params.idUser) {
        dbHandlers.Qgen_user.Qget_UserById(req.params.idUser, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).json({message: "Database error getting user by ID", err})
            }
            else {
                return res.json(results)
            }
        })
    }
}

module.exports = {
    getUserById
}