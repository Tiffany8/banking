import path from 'path'

import autoLoad from '@fastify/autoload'
import Fastify, { type FastifyInstance } from 'fastify'
import { fastifyYupSchema } from 'fastify-yup-schema'
import sqlite3 from 'sqlite3'

import { initDatabase } from './db'
import { type TResource } from './types'

const server: FastifyInstance = Fastify({
  logger: true,
  ignoreTrailingSlash: true
})

const db = new sqlite3.Database('transfers.db')
server.decorate('db', db)

declare module 'fastify' {
  interface FastifyInstance {
    db: sqlite3.Database
    fixtures: Map<string, TResource[]>
  }
}

const start: () => Promise<void> = async (): Promise<void> => {
  await server.register(fastifyYupSchema)
  await server.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: {}
  })

  await server.ready()
  await initDatabase(server.db)

  try {
    await server.ready()
    await server.listen({ port: 8080 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

void start()
