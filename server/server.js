const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const config = require('./config.json')
const cors = require('cors')
const controllers = require('./controllers')

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(bodyParser.json())

app.use(require('./controllers/middleware/authentication'))

app.get('/test', (req, res, next) => {
    console.log('a')
    return res.status(200).send("testado")
})

// Authentication routes
app.post('/api/login', controllers.authentication.login)
app.post('/api/signup', controllers.authentication.signup)

// User routes
app.get('/api/user/:idUser', controllers.user.getUserById)
// END User routes

// Project routes
app.get('/api/project/:idProject', controllers.project.getProjectById)
app.get('/api/projectsUser/:idUser', controllers.project.getProjectsByUserId)
app.post('/api/project', controllers.project.createProject)
app.patch('/api/project/:idProject', controllers.project.patchProject)
app.delete('/api/project/:idProject', controllers.project.deleteProject)
//END Project routes

// Task routes
app.get('/api/task/:idTask', controllers.task.getTaskById)
app.get('/api/tasksProject/:idProject', controllers.task.getTasksByProjectId)
app.post('/api/task', controllers.task.createTask)
app.patch('/api/task/:idTask', controllers.task.patchTask)
app.delete('/api/task/:idTask', controllers.task.deleteTask)
//END Task routes

server.listen(5000, () => {
    console.log('Server listening on port 5000')
})