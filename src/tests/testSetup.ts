import path from 'path'

import Fastify, { type FastifyInstance } from 'fastify'
import autoLoad from '@fastify/autoload'
// @ts-expect-error no types package available
import fastifySqlite from 'fastify-sqlite'

export const buildTestFastifyInstance: () => FastifyInstance =
  (): FastifyInstance => {
    const server: FastifyInstance = Fastify({
      logger: false,
      ignoreTrailingSlash: true
    })

    void server.register(autoLoad, {
      dir: path.join(__dirname, '..', 'routes'),
      options: {}
    })

    void server.register(fastifySqlite, {
      dbFile: ':memory:',
      promiseApi: true,
      name: 'db',
      mode: fastifySqlite.sqlite3.OPEN_READWRITE
    })

    return server
  }
