'use strict'

import { resolve } from 'path'
import * as fs from 'fs'


const register = async (server, options = {}) => {
  var root = resolve(process.cwd(), options.rootDir || './dist')

  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory())
    throw new Error('statics: ' + root + ' does not exists or is not a directory')

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: root,
        redirectToSlash: false,
        lookupCompressed: true
      }
    }
  })

  // server.ext('onPreResponse', (request, h) => {
  //   const response = request.response
  //   if (response.isBoom && response.output.statusCode === 404) {
  //     return h.response({ status: 'KO', message: 'File not found' }).code(404)
  //   }

  //   return h.continue
  // })
}

const plugin = {
  name: 'internal-statics',
  version: '1.0.0',
  dependencies: ['@hapi/inert'],
  register
}

export default plugin
