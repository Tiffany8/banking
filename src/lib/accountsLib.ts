/* eslint-disable @typescript-eslint/promise-function-async */
import { type Database } from 'sqlite3'

import { type TAccount } from '../types/accounts'
import { APIError } from '../types/errors'

const insertAccount: ({
  db,
  customerId,
  accountNumber,
  routingNumber
}: {
  db: Database
  customerId: number
  accountNumber: string
  routingNumber: string
}) => Promise<TAccount> = async ({
  db,
  customerId,
  accountNumber,
  routingNumber
}): Promise<TAccount> => {
  return await new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM customers WHERE id = ?',
      [customerId],
      (err: Error | null, row?: TAccount) => {
        if (err !== null) {
          reject(APIError(500, err.message))
        } else if (row === undefined) {
          reject(APIError(404, `Customer ${customerId} not found`))
        } else {
          db.run(
            'INSERT INTO accounts (customer_id, account_number, routing_number) VALUES (?, ?, ?)',
            [customerId, accountNumber, routingNumber],
            function (this: { lastID?: number | null }, err: Error | null) {
              if (err !== null) {
                reject(APIError(500, err.message))
              } else if (this?.lastID === undefined || this?.lastID === null) {
                reject(APIError(500, 'No lastID returned'))
              } else {
                resolve({
                  id: this.lastID,
                  customer_id: customerId,
                  account_number: accountNumber,
                  routing_number: routingNumber
                })
              }
            }
          )
        }
      }
    )
  })
}

export default {
  insertAccount
}
