/* eslint-disable @typescript-eslint/promise-function-async */
import { type Database } from 'sqlite3'
import { type TCustomer } from '../types/customers'

// This is just a temporary, test lib function
export const getCustomerHelloWorld: ({
  db,
  id
}: {
  db: Database
  id: string
}) => Promise<TCustomer | null> = ({ db, id }): Promise<TCustomer | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM customers WHERE id = ?',
      [id],
      (err: Error | null, row?: TCustomer) => {
        if (err !== null) {
          reject(new Error(`Error retrieving row: ${err.message}`))
        } else if (row !== undefined) {
          resolve(row)
        } else {
          resolve(null)
        }
      }
    )
  })
}
