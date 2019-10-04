const express = require('express')
const actionDb = require('../data/helpers/actionModel')
const projectDb = require('../data/helpers/projectModel')

const actionRouter = express.Router()

// GET - get all actions
actionRouter.get('/', async (req, res) => {
  try {
    const actions = await actionDb.get()
    res.status(200).json(actions)
  } catch (error) {
    // log error to server
    console.log(error)
    res.status(500).json({ message: 'Error retrieving actions' })
  }
})

// GET - get action by id
actionRouter.get('/:id', async (req, res) => {
  try {
    const action = await actionDb.get(req.params.id)
    res.status(200).json(action)
  } catch (error) {
    // log error to server
    console.log(error)
    res.status(500).json({ message: 'Error retrieving action' })
  }
})

// POST - add new action to project
actionRouter.post('/:id', validateAction, async (req, res) => {
  try {
    // inserting valid action into database
    const newAction = await actionDb.insert(req.body)
    res.status(201).json(newAction)
  } catch (error) {
    res.status(500).json({ message: 'Error adding action' })
  }
})

// PUT - update a action for a project
actionRouter.put('/:id', validateAction, async (req, res) => {
  try {
    const updatedAction = await actionDb.update(req.params.id, req.body)
    if (updatedAction) {
      res.status(200).json(updatedAction)
    } else {
      res.status(400).json({ message: 'action Id invalid' })
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating action" })
  }
})

// DELETE - delete an action from a project
actionRouter.delete('/:id', async (req, res) => {
  try {
    const deletedAction = await actionDb.remove(req.params.id)
    if (deletedAction) {
      res.status(200).json(deletedAction)
    } else {
      res.status(400).json({ message: 'action Id invalid' })
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting action" })
  }
})

// CUSTOM MIDDLEWARE

// validates the body on a request to create a new action
async function validateAction(req, res, next) {
  console.log('____VALIDATE ACTION RAN____')
  try {
    // checks if project id is valid
    const associatedProject = await projectDb.get(req.params.id)
    if (associatedProject) {
      // sets req.param.id as action's associated project id
      req.body.project_id = req.params.id
    } else {
      res.status(400).json({ message: 'project id is invalid' })
    }
  } catch (error) {
    res.status(500).json({ message: "error validating action" })
  }

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

module.exports = actionRouter
