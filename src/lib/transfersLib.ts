/* eslint-disable @typescript-eslint/promise-function-async */
import { type Database } from 'sqlite3'
import { type TTransfer } from '../types/transfers'

const getTransfers: ({
  db,
  offset,
  limit
}: {
  db: Database
  offset: number
  limit: number
}) => Promise<TTransfer[]> = ({ db, offset, limit }): Promise<TTransfer[]> => {
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

const getTransferById: ({
  db,
  id
}: {
  db: Database
  id: string
}) => Promise<TTransfer | null> = ({ db, id }): Promise<TTransfer | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT transfers.*, CONCAT(source.first_name, " ", source.last_name) AS source_customer_name, CONCAT(dest.first_name, " ", dest.last_name) AS destination_customer_name FROM transfers INNER JOIN customers source ON transfers.source_account_id = source.id INNER JOIN customers dest ON transfers.dest_account_id = dest.id WHERE id = ?',
      [id],
      (err: Error | null, row?: TTransfer) => {
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

export default {
  getTransfers,
  getTransferById
}
