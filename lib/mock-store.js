/**
 * @module MockStore
 * @author Jesse Weed <jeweed@deloitte.com>
 * @description
 * Mock storage utility to allow for stand-alone use outside of Electron application
 */
module.exports = class MockStore {
    constructor() {
        this.store = new Store()
        this.setDefaultValues()
        this.setConfigData()
    }

    /**
     * @method setDefaultValues
     * @description
     * Setup defaults for all values in store
     **/
    setDefaultValues() {
        this.setInitialKey('settings.server.port', 3000)
        this.setInitialKey('settings.electron.port', 1990)
        this.setInitialKey('isDesktop', false)
        this.setInitialKey('preferences', {})
        this.setInitialKey('preferences.serverPort', 3000)
        this.setInitialKey('storageType', 'mock')
        this.set('configFileLoaded', false)
    }

    /**
     * @method setConfigData
     * @description
     * Pulls data from config file, and saves to local store
     **/
    setConfigData() {
        // this.config = new Config({
        //   store: this
        // })
    }

    /**
     * @method data
     * @description
     * Returns a list of all data in store
     **/
    data() {
        return this.store.store()
    }

    /**
     * @method get
     * @description
     * Get value by key
     * @param {string} key name of key to fetch
     **/
    get(key) {
        return this.store.get(key)
    }

    /**
     * @method set
     * @description
     * Set value by key
     * @param {string} key name of key to save as
     * @param {string|array|object} value what value to save
     **/
    set(key, value) {
        this.store.set(key, value)
    }

    /**
     * @method setInitialKey
     * @description
     * Similar to set(), but only sets value if not already set
     * @param {string} key name of key to save as
     * @param {string|array|object} value what value to save
     **/
    setInitialKey(key, value) {
        const current = this.store.get(key)
        if (!current) this.store.set(key, value)
    }

    /**
     * @method onDidChange
     * @description
     * On change listener. Fired when a specific key is updated.
     * @param {string} key name of key to save as
     * @param {function0} cb callback to trigger when data changes
     **/
    onDidChange(key, cb) {
        this.store.onDidChange(key, cb)
    }
}

// Mimic electron-store functionality
class Store {
    constructor() {
        this.data = {}
        this.watchers = {}
    }

    get(key) {
        return this.data[key]
    }

    set(key, value) {
        if (this.watchers[key]) {
            this.watchers[key].map((cb) => {
                if (cb && typeof cb === 'function') cb({ key, value })
            })
        }
        return (this.data[key] = value)
    }

    onDidChange(key, cb) {
        if (!this.watchers[key]) this.watchers[key] = []
        this.watchers[key].push(cb)
    }

    store(key) {
        return this.data
    }
}
