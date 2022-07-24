const dbHandlers = require('../db')

// Get task by ID
const getTaskById = (req, res, next) => {
    if (req.params.idTask) {
        dbHandlers.Qgen_task.Qget_TaskById(req.params.idTask, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).json({message: "Database error getting task by ID", err})
            }
            else if (results) {
                return res.json(results)
            }
            else {
                return res.status(404).send({message: "Task not found"})
            }
        })
    }
    else {
        return res.status(400).send({message: "Bad request"})
    }
}

// Create task
const createTask = (req, res, next) => {
    if (req.body.description && req.body.finishDate && req.body.idProject) {
        dbHandlers.Qgen_task.Qpost_Task([req.body.description, req.body.finishDate, req.body.idProject], (err, results) => {
            if (err) {
                return res.status(500).send({ message: "Database error creating task", err})
            }
            return res.status(201).send({message: "Task created"})
        })
    }
    else {
        return res.status(400).send({message: "Bad request"})
    }
}

// Edit task
const patchTask = (req, res, next) => {
    if (req.params.idTask && (req.body.description || req.body.finishDate || req.body.status)) {
        dbHandlers.Qgen_task.Qpatch_Task(req.params.idTask, 
            JSON.parse(
                JSON.stringify({
                    description: req.body.description,
                    finish_date: req.body.finishDate,
                    status: req.body.status
                })), (err, results) => {
            if (err) {
                return res.status(500).send({message: "Database error patching task"})
            }
            return res.json(results)
        })
    }
    else {
        return res.status(400).send({message: "Bad request"})
    }
}

// Delete task (patch deleted key, keep record in DB)
const deleteTask = (req, res, next) => {
    if (req.params.idTask) {
        dbHandlers.Qgen_task.Qpatch_Task(req.params.idTask, {deleted: 1}, (err, results) => {
            if (err) {
                return res.status(500).send({message: "Database error deleting task"})
            }
            return res.send({message: "Task deleted"})
        })
    }
}

module.exports = {
    getTaskById,
    createTask,
    patchTask,
    deleteTask
}