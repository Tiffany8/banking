import path from 'path'

import autoLoad from '@fastify/autoload'
import Fastify, { type FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
// import fastifySqlite from 'fastify-sqlite'
// import { fastifyYupSchema } from 'fastify-yup-schema'
import { yupPlugin } from 'fastify-type-provider-yup'
import { fastifyYupSchema } from 'fastify-yup-schema'
import sqlite3 from 'sqlite3'

const server: FastifyInstance = Fastify({
  logger: true,
  ignoreTrailingSlash: true
})

const db = new sqlite3.Database('transfers.db')
server.decorate('db', db)

declare module 'fastify' {
  interface FastifyInstance {
    db: sqlite3.Database
  }
}

const initDatabase = async (db: sqlite3.Database): Promise<void> => {
  const queries: string[] = [
    `CREATE TABLE IF NOT EXISTS customers (
      id TEXT NOT NULL PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      date_of_birth DATE,
      email TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS accounts (
        id TEXT NOT NULL PRIMARY KEY,
        customer_id TEXT NOT NULL,
        routing_number TEXT,
        account_number TEXT,

        FOREIGN KEY (customer_id) REFERENCES customers(id)
    );`,
    `CREATE TABLE IF NOT EXISTS transfers (
        id TEXT NOT NULL PRIMARY KEY,
        timestamp DATETIME NOT NULL,
        amount INTEGER NOT NULL,
        status TEXT NOT NULL,
        source_account_id TEXT,
        dest_account_id TEXT,

        FOREIGN KEY (source_account_id) REFERENCES accounts(id),
        FOREIGN KEY (dest_account_id) REFERENCES accounts(id)
    );`
  ]

  for (const query of queries) {
    try {
      db.get(query)
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      server.log.error(`Error initializing tables ${err}`)
    }
  }
}

const start: () => Promise<void> = async (): Promise<void> => {
  // await server.register(fp(yupPlugin))
  await server.register(fastifyYupSchema)
  await server.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: {}
  })

  // await server.register(fastifySqlite, {
  //   dbFile: 'transfers.db',
  //   verbose: true,
  //   promiseApi: true, // db instance supports the Promise API
  //   name: 'db', // decorator name
  //   mode: fastifySqlite.sqlite3.OPEN_READWRITE
  // })

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
