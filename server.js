const express = require('express')
const helmet = require('helmet')
const projectRouter = require('./routers/projectRouter')
const actionRouter = require('./routers/actionRouter')

const server = express()

// global middleware
server.use(express.json())
server.use('/api/projects', logger, projectRouter)
server.use('/api/actions', logger, actionRouter)

// custom logger middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.url} at ${new Date().toISOString()}`)
  next()
}

module.exports = server
