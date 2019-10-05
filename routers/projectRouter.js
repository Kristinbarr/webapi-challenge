const express = require('express')
const projectDb = require('../data/helpers/projectModel')
const { validateProject, validateProjectId } = require('../middleware')

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
    console.log(error)
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
    console.log(error)
    res.status(500).json({ message: 'Error deleting project' })
  }
})

module.exports = projectRouter
