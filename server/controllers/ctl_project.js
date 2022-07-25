const dbHandlers = require('../db')

// Get project by ID
const getProjectById = (req, res, next) => {
    if (req.params.idProject) {
        dbHandlers.Qgen_project.Qget_ProjectById(req.params.idProject, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).json({message: "Database error getting project by ID", err})
            }
            else if (results) {
                return res.json(results)
            }
            else {
                return res.status(404).send({message: "Project not found"})
            }
        })
    }
    else {
        return res.status(400).send({message: "Bad request"})
    }
}

// Get projects by User ID
const getProjectsByUserId = (req, res, next) => {
    if (req.params.idUser) {
        dbHandlers.Qgen_project.Qget_ProjectsByUserId(req.params.idUser, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).json({message: "Database error getting projects by User ID", err})
            }
            else if (results && results.length > 0) {
                console.log
                return res.json(results)
            }
            else {
                return res.status(404).send({message: "No projects found"})
            }
        })
    }
    else {
        return res.status(400).send({message: "Bad request"})
    }
}

// Create project
const createProject = (req, res, next) => {
    if (req.body.name && req.body.idUser) {
        dbHandlers.Qgen_project.Qpost_Project([req.body.name, req.body.idUser], (err, results) => {
            if (err) {
                return res.status(500).send({ message: "Database error creating project", err})
            }
            return res.status(201).send({message: "Project created"})
        })
    }
    else {
        return res.status(400).send({message: "Bad request"})
    }
}

// Edit project
const patchProject = (req, res, next) => {
    if (req.params.idProject && req.body.name) {
        dbHandlers.Qgen_project.Qpatch_Project(req.params.idProject, {name: req.body.name}, (err, results) => {
            if (err) {
                return res.status(500).send({message: "Database error patching project"})
            }
            return res.json(results)
        })
    }
    else {
        return res.status(400).send({message: "Bad request"})
    }
}

// Delete project (patch deleted key, keep record in DB)
const deleteProject = (req, res, next) => {
    if (req.params.idProject) {
        dbHandlers.Qgen_project.Qpatch_Project(req.params.idProject, {deleted: 1}, (err, results) => {
            if (err) {
                return res.status(500).send({message: "Database error deleting project"})
            }
            return res.send({message: "Project deleted"})
        })
    }
}

module.exports = {
    getProjectById,
    getProjectsByUserId,
    createProject,
    patchProject,
    deleteProject
}