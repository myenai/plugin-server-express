// MODULES
const path        = require('path')
const express     = require('express')

// UTILS
const Notifyer    = require('./lib/notifier')
const Middleware  = require('./lib/middleware')
const MockStore   = require('./lib/mock-store')
const Router      = require('./lib/router')

/**
 * @module Server
 * @author Jesse Weed <jeweed@deloitte.com>
 * @description
 * This is the main entry for starting our node server
 * - It sets up our storage with electron-store (or mock when running stand-alone)
 * - Setup routing & serve static & css dirs
 */
module.exports = class Server {

  constructor({ directories, scss, storage }) {
    // bindings
    this.onReady = this.onReady.bind(this)
    this.scss = scss || false;

    this.directories = {
      css: path.join(__dirname, '/css/'),
      server: path.join(__dirname, '/'),
      static: [ path.join(__dirname, '/static/') ],
      views: path.join(__dirname, '/views/')
    }

    if (directories) {
      if (directories.css) this.directories.css = directories.css
      if (directories.server) this.directories.server = directories.server
      if (directories.static) this.directories.static = directories.static
      if (directories.views) this.directories.views = directories.views
    }

    // Variables
    this.timeout = 1000;
    this.processTime = 0;
    this.hooks = {
      onReady: [],
      onRestart: [],
      onStart: [],
      onStop: [],
    };
    this.storage = storage;
    this.isRunning = false
    this.server = express()
    this.router = new Router(this.server)
    this.addRoute = this.router.addRoute
    this.notifier = new Notifyer('myenai:plugin:server:express')
    this.hasInitialized = true
    this.triggerHooks('onReady')
    return this
  }

  triggerHooks(which) {

    if (this.hooks[which]) {
      try {
        this.hooks[which].map((cb) => {
          if (typeof cb === 'function') cb()
        })
      } catch (err) {
        this.notifier.error(`Error running ${which} callback`, err)
      }
    }

  }

  // Allowing adding to static dirs from myenai
  addStatic(dir) {
    server.use(express.static(dir))
  }

  /**
   * @method start
   * @description
   * Initialize Server
   * - Setup storage
   * - Find apps & components
   */
  start() {
    return new Promise((resolve) => {
      if (!this.storage) {
        this.notifier.log('using mock storage')
        this.storage = MockStore
      }

      this.notifier.log('Starting node server...')

      this.isRunning = true
      this.port = this.storage.get('settings.server.port') || 1981
      this.notifier.log('C')

      Middleware({
        server: this.server,
        dirs: this.directories,
        scss: this.scss
      })

      this.serverInstance = this.server.listen(this.port, () => {
        this.notifier.log(
          '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n',
          `NODE SERVER STARTED http://localhost:${this.port}\n`,
          `Storage type: ${this.storage.get('storageType')}\n`,
          '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
        )
        this.notifier.notify({
          message: `Node server started: http://localhost:${this.port}`
        })
        this.notifier.log('Resolve server...')
        resolve(this)
      })
    })
  }

  /**
   * @method onReady
   * @description
   * Called when server is ready to add routes, etc
   */
  onReady(cb) {
    if (this.hasInitialized && typeof cb === 'function') cb()
    else this.hooks.onReady.push(cb)
  }

  /**
   * @method restart
   * @description
   * Allows external scripts to request server to restart
   * @param {function} [cb] Callback to run after server has restarted
   */
  restart(cb) {
    this.isRunning = false

    this.notifier.log('Restarting node server...')

    if (this.serverInstance) {
      this.serverInstance.close()
    }

    this.start();

  }

  /**
   * @method stop
   * @description
   * Allows external scripts to request server to stop
   */
  stop() {
    this.notifier.log({
      message: 'Stopping node server...'
    })

    if (this.serverInstance) {
      this.serverInstance.close(() => {
        return process.exit(0)
      })
    }
  }

}
