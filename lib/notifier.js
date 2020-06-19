const path      = require('path')
const notifier  = require('node-notifier')
const logdown   = require('logdown')

/**
 * Notification helper class
 * @author Jesse Weed <jeweed@deloitte.com>
 * @module Notifier
 * @description
 * Notification utility to handle application-wide notifications
 * - Log to the console (in browser or terminal)
 * - Send growl style notification via app
 */
module.exports = class Notifyer {
  /**
   * @method constructor
   * @description
   * Initialize a new notifier instance
   * @param {string} name Name of module sending notification
   **/
  constructor(name) {
    this.logger = logdown(name)
    if (this.logger && this.logger.state) {
      this.logger.state.isEnabled = true
    }
  }

  /**
   * @method error
   * @description
   * Log an error message to the console
   * @param {object} args Data to log to console
   **/
  error(...args) {
    args.filter((arg, index) => {
      if (typeof arg === 'object') args[index] = arg
      else args[index] = `  ${arg}`
    })
    this.logger.error(...args)
  }

  /**
   * @method info
   * @description
   * Log an info message to the console
   * @param {object} args Data to log to console
   **/
  info(...args) {
    args.filter((arg, index) => {
      if (typeof arg === 'object') args[index] = arg
      else args[index] = `  ${arg}`
    })
    this.logger.info(...args)
  }

  /**
   * @method log
   * @description
   * Log an standard message to the console
   * @param {object} args Data to log to console
   **/
  log(...args) {
    args.filter((arg, index) => {
      if (typeof arg === 'object') args[index] = arg
      else args[index] = `  ${arg}`
    })
    this.logger.log('\n', ...args, '\n')
  }

  /**
   * @method warn
   * @description
   * Log an warning message to the console
   * @param {object} args Data to log to console
   **/
  warn(...args) {
    args.filter((arg, index) => {
      if (typeof arg === 'object') args[index] = arg
      else args[index] = `  ${arg}`
    })
    this.logger.warn(...args)
  }

  /**
   * @method notify
   * @description
   * Display a push notification from node or electron app
   * @param {object} data Data to log to console
   * @param {string} [data.title] Title for notification
   * @param {string} [data.message] Title for notification
   * @param {string|bool} [data.icon] Path to image to use as icon (or false for no icon)
   * @param {number} [data.wait] How long to wait before dismissing notification
   * @param {function} [data.onClick] Function to call when user clicks notification
   * @param {function} [data.onTimeout] Function to call when notification times out
   **/
  notify(data) {
    const fallback = {
      title: data.title || 'AEM Toolbox',
      message: 'Hi!',
      icon: path.join(__dirname, '../../static/icon.png'),
      wait: false,
      onClick: null,
      onTimeout: null
    }

    if (typeof data !== 'object') {
      data = {
        title: data.title || fallback.title,
        message: data.message || fallback.message,
        icon: data.icon || fallback.icon,
        wait: data.wait || fallback.wait,
        onClick: data.onClick || fallback.onClick,
        onTimeout: data.onTimeout || fallback.onTimeout
      }
    } else {
      if (!data.title) data.title = fallback.title
      if (!data.message) data.message = fallback.message
      if (!data.icon) data.icon = fallback.icon
      if (!data.wait) data.wait = fallback.wait
      if (!data.onClick) data.onClick = fallback.onClick
      if (!data.onTimeout) data.onTimeout = fallback.onTimeout
    }

    notifier.notify(data)

    if (data.onClick && typeof data.onClick === 'function')
      notifier.on('click', data.onClick)
    if (data.onTimeout && typeof data.onTimeout === 'function')
      notifier.on('click', data.onTimeout)
  }
}
