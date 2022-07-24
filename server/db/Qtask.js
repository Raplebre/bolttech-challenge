const Qget_TaskById = (id, cb) => {
    return myQuery(`SELECT * FROM task WHERE task.idTask = ?`,
    [id], (error, results, fields) => {
        error ? cb(error) : cb(false, results[0])
    })
}

const Qpost_Task = (values, cb) => {
    return myQuery(`INSERT INTO task (description, finish_date, project_idProject) VALUES (?)`, [values], (err, res) => {
        err ? cb(err) : cb(null, res)
    })
}

const Qpatch_Task = (id, values, cb) => {
    return myQuery(`UPDATE task SET ? WHERE idTask = ?`, [values, id], (err, res) => {
        err ? cb(err) : cb(null, res)
    })
}

module.exports = (myQuery) => {
    return {
        Qget_TaskById,
        Qpost_Task,
        Qpatch_Task
    }
}