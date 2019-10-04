const express = require('express')
const actionDb = require('./data/helpers/actionModel')
const projectDb = require('./data/helpers/projectModel')

const router = express.Router()

// GET - get all projects
router.get('/', async (req, res) => {
  try {
    const users = await projectDb.get()
    res.status(200).json(users)
  } catch (error) {
    // log error to server
    console.log(error)
    res.status(500).json({ message: 'Error retrieving projects' })
  }
})

// GET - project by id
router.get('/:id', validateProjectId, (req, res) => {
  // req.project is added by validationProjectId middleware
  if (req.project) {
    res.status(200).json(req.project)
  } else {
    res.status(404).json({ message: 'project not found' })
  }
})

// GET - get project actions
router.get('/:id/actions', async (req, res) => {
  try {
    const actions = projectDb.getProjectActions(req.params.id)
    console.log('actions',actions)
    res.status(200).json(actions)
  } catch (error) {
    // log error to server
    console.log(error)
    res.status(500).json({ message: 'Error retrieving actions' })
  }
})

// POST - add new project
router.post('/', validateProject, async (req, res) => {
  try {
    const project = req.body
    const newProject = await projectDb.insert(project)
    res.status(201).json(newProject)
  } catch (error) {
    // log error to server
    console.log(error)
    res.status(500).json({ message: 'Error adding project' })
  }
})

// POST - add new action to project
router.post('/:id', validateProjectId, validateAction, async (req, res) => {})

// PUT - update a project
router.put('/:id', (req, res) => {})

// PUT - update a action for a project
router.put('/:projectId/action/:actionId', (req, res) => {})

// DELETE - delete a project
router.delete('/:id', (req, res) => {})

// DELETE - delete an action from a project
router.delete('/:projectId/action/:actionId', (req, res) => {})

// CUSTOM MIDDLEWARE
// validate project id and add project body to req
async function validateProjectId(req, res, next) {
  try {
    const project = await projectDb.get(req.params.id)
    if (project) {
      console.log('____VALIDATE PROJECT ID RAN___')
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

// validates the body on a request to create a new action
function validateAction(req, res, next) {
  console.log('____VALIDATE ACTION RAN____')
  if (JSON.stringify(req.body) === '{}') {
    // check if body has data
    res.status(400).json({ message: 'missing post data' })
  } else if (!req.body.project_id) {
    // checks if body project_id exists
    res.status(400).json({ message: 'missing required project_id field' })
  } else if (!req.body.description) {
    // checks if body description exists
    res.status(400).json({ message: 'missing required description field' })
  } else if (!req.body.notes) {
    // checks if body notes exists
    res.status(400).json({ message: 'missing required notes field' })
  } else {
    next()
  }
}

module.exports = router
