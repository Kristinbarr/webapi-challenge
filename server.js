const express = require('express')
const helmet = require('helmet')
const router = require('./router')

const server = express()

// global middleware
server.use(express.json())
server.use('/api/projects', logger, router)

// custom logger middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.url} at ${new Date().toISOString()}`)
  next()
}

module.exports = server
