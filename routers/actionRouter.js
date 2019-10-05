const express = require('express')
const actionDb = require('../data/helpers/actionModel')
const projectDb = require('../data/helpers/projectModel')
const { validateAction } = require('../middleware')

const actionRouter = express.Router()

// GET - get all actions
actionRouter.get('/', async (req, res) => {
  try {
    const actions = await actionDb.get()
    res.status(200).json(actions)
  } catch (error) {
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
    console.log(error)
    res.status(500).json({ message: 'Error retrieving action' })
  }
})

// POST - add new action to project
actionRouter.post('/:id', validateAction, async (req, res) => {
  try {
    const newAction = await actionDb.insert(req.body)
    res.status(201).json(newAction)
  } catch (error) {
    console.log(error)
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
    console.log(error)
    res.status(500).json({ message: 'Error updating action' })
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
    console.log(error)
    res.status(500).json({ message: 'Error deleting action' })
  }
})

module.exports = actionRouter
