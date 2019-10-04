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
router.post('/:id', validateAction, async (req, res) => {
  // project_id is aded in validateAction middleware
  try {
    const newAction = await actionDb.insert(req.body)
    res.status(201).json(newAction)
  } catch (error) {
    res.status(500).json({ message: 'Error adding project action' })
  }
})

// PUT - update a project
router.put('/:id', validateProject, async (req, res) => {
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

// PUT - update a action for a project
router.put('/:id/actions/:actionId', validateAction, async (req, res) => {
  // checks if project matches associated action project_id
  if (req.params.id !== req.body.project_id) {
    res.status(400).json({message: "project id is not associated with action"})
  }

  try {
    const updatedAction = await actionDb.update(req.params.actionId, req.body)
    if (updatedAction) {
      res.status(200).json(updatedAction)
    } else {
      res.status(400).json({message: "Error updating action"})
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating project's action" })
  }
})

// DELETE - delete a project
router.delete('/:id', validateProjectId, async (req, res) => {
  try {
    const deleted = await projectDb.remove(req.params.id)
    if (deleted) {
      res.status(204).json(deleted)
    } else {
      res.status(400).json({ message: 'project Id invalid' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' })
  }
})

// DELETE - delete an action from a project
router.delete('/:id/action/:actionId', validateAction, async (req, res) => {
    // checks if project matches associated action project_id
  if (req.params.id !== req.body.project_id) {
    res
      .status(400)
      .json({ message: 'project id is not associated with action' })
  }

  try {
    const deletedAction = await actionDb.remove(req.params.actionId)
    if (deletedAction) {
      res.status(204).json(deletedAction)
    } else {
      res.status(400).json({ message: 'action Id invalid' })
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting project's action" })
  }
})

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
  // sets req.param.id as action's associated project ID
  req.body.project_id = req.params.id

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
