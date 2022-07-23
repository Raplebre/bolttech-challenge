const Qget_UserById = (id, cb) => {
    return myQuery(`SELECT * FROM user WHERE user.idUser = ?`,
    [id], (error, results, fields) => {
        error ? cb(error) : cb(false, results[0])
    })
}

const Qget_UserByEmail = (email, cb) => {
    return myQuery(`SELECT * FROM user WHERE user.email = ?`,
    [email], (error, results, fields) => {
        error ? cb(error) : cb(false, results[0])
    })
}

const Qcreate_User = (values, cb) => {
    return myQuery(`INSERT INTO user (username, email, hash, salt) VALUES (?)`,
    [values], (error, results, fields) => {
        error ? cb(error) : cb(null, results)
    })
}

module.exports = (myQuery) => {
    return {
        Qget_UserById,
        Qget_UserByEmail,
        Qcreate_User
    }
}