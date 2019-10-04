const express = require('express')
const projectDb = require('../data/helpers/projectModel')

const projectRouter = express.Router()

// GET - get all projects
projectRouter.get('/', async (req, res) => {
  try {
    const users = await projectDb.get()
    res.status(200).json(users)
  } catch (error) {
    // log error to server
    console.log(error)
    res.status(500).json({ message: 'Error retrieving projects' })
  }
})

// GET - get project by id
projectRouter.get('/:id', validateProjectId, (req, res) => {
  // req.project is added by validationProjectId middleware
  if (req.project) {
    res.status(200).json(req.project)
  } else {
    res.status(404).json({ message: 'project not found' })
  }
})

// POST - add new project
projectRouter.post('/', validateProject, async (req, res) => {
  try {
    const newProject = await projectDb.insert(req.body)
    res.status(201).json(newProject)
  } catch (error) {
    // log error to server
    console.log(error)
    res.status(500).json({ message: 'Error adding project' })
  }
})

// PUT - update a project
projectRouter.put('/:id', validateProject, async (req, res) => {
  try {
    const updatedProject = await projectDb.update(req.params.id, req.body)
    if (updatedProject) {
      res.status(200).json(updatedProject)
    } else {
      res.status(400).json({ message: 'project Id invalid' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' })
  }
})

// DELETE - delete a project
projectRouter.delete('/:id', validateProjectId, async (req, res) => {
  try {
    const deleted = await projectDb.remove(req.params.id)
    if (deleted) {
      res.status(200).json(deleted)
    } else {
      res.status(400).json({ message: 'project Id invalid' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' })
  }
})

// CUSTOM MIDDLEWARE

// validate project id and add project body to req
async function validateProjectId(req, res, next) {
  console.log('____VALIDATE PROJECT ID RAN___')
  try {
    const project = await projectDb.get(req.params.id)
    if (project) {
      req.project = project
      next()
    } else {
      res.status(400).json({ message: 'invalid project id' })
    }
  } catch (error) {
    res.status(500).json({
      error: 'There was an error while validating project id'
    })
  }
}

// validates the body on a request to create a new project
function validateProject(req, res, next) {
  console.log('____VALIDATE PROJECT RAN____')
  if (JSON.stringify(req.body) === '{}') {
    // check if body has data
    res.status(400).json({ message: 'missing project data' })
  } else if (!req.body.name) {
    // checks if body name exists
    res.status(400).json({ message: 'missing required name field' })
  } else if (!req.body.description) {
    // checks if body description exists
    res.status(400).json({ message: 'missing required description field' })
  } else {
    next()
  }
}

module.exports = projectRouter
