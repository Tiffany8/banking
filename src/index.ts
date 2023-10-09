import path from 'path'

import autoLoad from '@fastify/autoload'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { extendSchema } from '@sodaru/yup-to-json-schema'
import Fastify, { type FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransformer,
  yupPlugin
} from 'fastify-type-provider-yup'
import sqlite3 from 'sqlite3'
import { Schema, addMethod } from 'yup'

import { initDatabase } from './db'
import { type TResource } from './types'

extendSchema({ addMethod, Schema })

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
  // Yup fastify-type-provider and swagger setup
  // https://github.com/jorgevrgs/fastify-type-provider-yup
  await server.register(fp(yupPlugin))

  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)

  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Banking API',
        description: 'A Simple Banking API',
        version: '1.0.0'
      },
      servers: []
    },
    transform: jsonSchemaTransformer
  })

  await server.register(fastifySwaggerUi, {
    routePrefix: '/docs'
  })

  await server.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: {}
  })

  await server.ready()
  await initDatabase(server.db)

  try {
    server.swagger()
    await server.listen({ port: 8080, host: '0.0.0.0' })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

void start()
