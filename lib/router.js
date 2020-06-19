class Router {
  constructor(server) {
    this.server = server
  }

  addRoute({ method, path, view, data, status = 200 }) {
    this.server[method](path, (req, res) => {
      if (view) res.status(status).render(view)
      else if (data) res.status(status).send(data)
    })
  }
}

module.exports = Router
