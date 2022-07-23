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
app.get('/api/user/:idUser')
// END User routes

server.listen(5000, () => {
    console.log('Server listening on port 5000')
})