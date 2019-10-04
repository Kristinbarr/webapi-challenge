const server = require('./server')

const port = 4040
server.listen(port, () => {
  console.log(`\n *** listening on localhost:${port} *** \n`)
})
