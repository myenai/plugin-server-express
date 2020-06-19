// const sass = require('node-sass-middleware')
const express = require('express')

/**
 * @module Server/Middleware
 * @author Jesse Weed <jeweed@deloitte.com>
 * @description
 * This sets up all middleware for our node server.
 * - Serve clientlibs with express static
 * - Parse sass files
 * - Set view directories
 * - Set pug as default view engine
 */
module.exports = ({ server, dirs, scss }) => {

  try {
      // Use pug for views
    server.set('view engine', 'pug')

    // Set view directory
    if (dirs.views) server.set('views', dirs.views)

    // Prettify output
    server.locals.pretty = process.env.NODE_ENV !== 'production'

    if (dirs.static) {
      dirs.static.map((dir) => {
      server.use(express.static(dir))
    })
    }

    // Add static file dirs
    // server.use(express.static(dirs.CSS))
    // server.use(express.static(dirs.STATIC))

  } catch (err) {
    console.error('Error configuring middleware', err)
  }

}
