# Myenai Express Server

Express server plugin for [Myenai](http://myenai.com) framework.

## Install

```#!/bin/bash
npm install @myenai/plugin-server-express
```

## Add to Myenai

```javascript
import MyenaiExpress from '@myenai/plugin-server-express'
import MyenaiStore from '@myenai/plugin-store'

const scss = path.resolve(__dirname, '../../scss')
const static = path.resolve(__dirname, '../../static')
const views = path.resolve(__dirname, '../../views')
const store = new MyenaiStore()

export default new Myenai({
  server: MyenaiExpress,
  storage: MyenaiStore,
  directories: {
    views: views,
    static: [
      static
    ]
  }
})
```
