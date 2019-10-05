const projectDb = require('./data/helpers/projectModel')

// validate project id and add project body to req
async function validateProjectId(req, res, next) {
  try {
    const project = await projectDb.get(req.params.id)
    if (project) {
      req.project = project
      next()
    } else {
      res.status(400).json({ message: 'invalid project id' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Error validating project id'
    })
  }
}

// validates the body on a request to create a new project
function validateProject(req, res, next) {
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
async function validateAction(req, res, next) {
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
    res.status(500).json({ message: 'error validating action' })
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

module.exports = { validateProjectId, validateProject, validateAction }
