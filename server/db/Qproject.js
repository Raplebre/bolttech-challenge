const Qget_ProjectById = (id, cb) => {
    return myQuery(`SELECT * FROM project WHERE project.idProject = ?`,
    [id], (error, results, fields) => {
        error ? cb(error) : cb(false, results[0])
    })
}

const Qpost_Project = (values, cb) => {
    return myQuery(`INSERT INTO project (name, user_idUser) VALUES (?)`, [values], (err, res) => {
        err ? cb(err) : cb(null, res)
    })
}

const Qpatch_Project = (id, values, cb) => {
    return myQuery(`UPDATE project SET ? WHERE idProject = ?`, [values, id], (err, res) => {
        err ? cb(err) : cb(null, res)
    })
}

module.exports = (myQuery) => {
    return {
        Qget_ProjectById,
        Qpost_Project,
        Qpatch_Project
    }
}