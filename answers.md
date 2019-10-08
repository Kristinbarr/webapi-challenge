Node, Express and Middleware

- Mention two parts of Express that you learned about this week.
  Express helps encapsulate some basic functionality of pure Node so we can write API CRUD routes fast and easily. Express can be set up to process middleware functions before running our crud routes. Express also includes built-in methods like .status() that provides information to clients about the request’s and global methods like .json() that is used to format responses.

- Describe Middleware?
  Middleware is usually validation or functionality that is separated out into it’s own function and applied to routes only when needed. It’s helpful to have when you have a lot of the same code being used repetitively.

- Describe a Resource?
  A resource is data that is available to be sent to and from a client through RESTful APIs.

- What can the API return to help clients know if a request was successful?
  A status code, a response body with possible formatting, or an error and message.

- How can we partition our application into sub-applications?
  We can create separate routers that have their own middleware and routing.
