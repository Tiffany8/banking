import path from 'path'

import autoLoad from '@fastify/autoload'
import Fastify, { type FastifyInstance } from 'fastify'
import sqlite3 from 'sqlite3'

import { initDatabase } from '../db'
import { type TAccount } from '../types/accounts'
import { type TCustomer, type TBaseCustomer } from '../types/customers'
import { type TBaseTransfer, type TTransfer } from '../types/transfers'

const VALID_ROUTING_NUMBER_BANK = [
  '559855324',
  '642141246',
  '060644697',
  '012247505'
]

export const buildTestFastifyInstance: () => Promise<FastifyInstance> =
  async (): Promise<FastifyInstance> => {
    const server: FastifyInstance = Fastify({
      logger: false,
      ignoreTrailingSlash: true
    })

    void server.register(autoLoad, {
      dir: path.join(__dirname, '..', 'routes'),
      options: {}
    })

    const db = new sqlite3.Database(':memory:')
    server.decorate('db', db)
    try {
      await initDatabase(server.db)
    } catch (err) {
      console.error('Error initializing database:', err)
    }

    const customers = await insertCustomers(server.db)
    const transfers = await insertTransfers(
      server.db,
      customers[0].id,
      customers[1].id
    )
    const accounts = await insertAccounts(
      server.db,
      customers.map((customer, index) => ({
        customerId: customer.id,
        validRoutingNumber: VALID_ROUTING_NUMBER_BANK[index]
      }))
    )
    const fixtures = new Map([
      ['customers', customers],
      ['transfers', transfers],
      ['accounts', accounts]
    ])
    server.decorate('fixtures', fixtures)

    server.log.info('end test setup')
    return server
  }

const insertCustomers = async (db: sqlite3.Database): Promise<TCustomer[]> => {
  const customers: TBaseCustomer[] = [
    {
      first_name: 'Alice',
      last_name: 'Walker',
      date_of_birth: '1990-01-01',
      email: 'alice@walker.net'
    },
    {
      first_name: 'Bob',
      last_name: 'Smith',
      date_of_birth: '1990-01-01',
      email: 'bob@smith.net'
    }
  ]

  const values = customers
    .map(
      (customer) =>
        `('${customer.first_name}', '${customer.last_name}', '${customer.date_of_birth}', '${customer.email}')`
    )
    .join(',')
  const sql = `INSERT INTO customers (first_name, last_name, date_of_birth, email) VALUES ${values}`

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(sql, (err: Error | null) => {
        if (err !== null) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

    const rows = await new Promise<TCustomer[]>((resolve, reject) => {
      db.all(
        'SELECT * FROM customers',
        (err: Error | null, rows?: TCustomer[]) => {
          if (err !== null) {
            reject(err)
          } else if (rows !== undefined) {
            resolve(rows)
          }
        }
      )
    })
    return rows
  } catch (err) {
    console.error('Error inserting or retrieving customers:', err)
    throw err
  }
}

const insertTransfers = async (
  db: sqlite3.Database,
  sourceCustomerId: number,
  destCustomerId: number
): Promise<TTransfer[]> => {
  const transfers: TBaseTransfer[] = [
    {
      timestamp: new Date().toISOString(),
      amount: 100,
      status: 'PENDING',
      source_account_id: sourceCustomerId,
      dest_account_id: destCustomerId
    },
    {
      timestamp: new Date().toISOString(),
      amount: 200,
      status: 'PENDING',
      source_account_id: sourceCustomerId,
      dest_account_id: destCustomerId
    }
  ]

  const values = transfers
    .map(
      (transfer) =>
        `('${transfer.timestamp}', '${transfer.amount}', '${transfer.status}', '${transfer.source_account_id}', '${transfer.dest_account_id}')`
    )
    .join(',')
  const sql = `INSERT INTO transfers (timestamp, amount, status, source_account_id, dest_account_id) VALUES ${values}`

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(sql, (err: Error | null) => {
        if (err !== null) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

    const rows = await new Promise<TTransfer[]>((resolve, reject) => {
      db.all(
        'SELECT * FROM transfers',
        (err: Error | null, rows?: TTransfer[]) => {
          if (err !== null) {
            reject(err)
          } else if (rows !== undefined) {
            resolve(rows)
          }
        }
      )
    })

    return rows
  } catch (err) {
    console.error('Error inserting or retrieving customers:', err)
    throw err
  }
}

const insertAccounts = async (
  db: sqlite3.Database,
  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  customerInfo: Array<{ customerId: number; validRoutingNumber: string }>
): Promise<TAccount[]> => {
  const values = customerInfo
    .map(
      ({ customerId, validRoutingNumber }) =>
        `('${customerId}', '${validRoutingNumber}', '${
          Math.floor(Math.random() * 9000000000) + 1000000000
        }')`
    )
    .join(',')
  const sql = `INSERT INTO accounts (customer_id, routing_number, account_number) VALUES ${values}`

  try {
    await new Promise<void>((resolve, reject) => {
      db.run(sql, (err: Error | null) => {
        if (err !== null) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

    const rows = await new Promise<TAccount[]>((resolve, reject) => {
      db.all(
        'SELECT * FROM accounts',
        (err: Error | null, rows?: TAccount[]) => {
          if (err !== null) {
            reject(err)
          } else if (rows !== undefined) {
            resolve(rows)
          }
        }
      )
    })

    return rows
  } catch (err) {
    console.error('Error inserting or retrieving accounts:', err)
    throw err
  }
}
