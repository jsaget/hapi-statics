'use strict'

import { resolve } from 'path'
import * as fs from 'fs'
import Joi from '@hapi/joi'

const schemaOptions = Joi.object({
  rootDir: Joi.string(),
})

const register = async (server, options = {}) => {
  schemaOptions.validate(options)

  var root = resolve(server.app.cwd, options.rootDir || './dist')
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error('hapi-statics: ' + root + ' does not exists or is not a directory')
  }

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: root,
        redirectToSlash: false,
        lookupCompressed: true,
      },
    },
  })
}

const plugin = {
  name: 'hapi-statics',
  version: '1.0.0',
  dependencies: ['@hapi/inert'],
  register,
}

export default plugin
