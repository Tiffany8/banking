/* eslint-disable @typescript-eslint/promise-function-async */
import { type Database } from 'sqlite3'
import { type TTransfer } from '../types/transfers'
import { TAccount } from '../types/accounts'

const insertAccount: ({
  db,
  customer_id,
  account_number,
  routing_number
}: {
  db: Database
  customer_id: string
  account_number: string
  routing_number: string
}) => Promise<TAccount> = ({
  db,
  customer_id,
  account_number,
  routing_number
}): Promise<TAccount> => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT transfers.*, CONCAT(source.first_name, " ", source.last_name) AS source_customer_name, CONCAT(dest.first_name, " ", dest.last_name) AS destination_customer_name FROM transfers INNER JOIN customers source ON transfers.source_account_id = source.id INNER JOIN customers dest ON transfers.dest_account_id = dest.id LIMIT ? OFFSET ?',
      [offset, limit],
      (err: Error | null, rows: TTransfer[]) => {
        if (err !== null) {
          reject(err)
        } else {
          resolve(rows)
        }
      }
    )
  })
}

export default {
  insertAccount
}
