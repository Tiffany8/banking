/* eslint-disable @typescript-eslint/promise-function-async */
import { type Database } from 'sqlite3'

import { APIError } from '../types/errors'
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
      `
      SELECT transfers.id, transfers.timestamp, transfers.amount, transfers.status, transfers.source_account_id, transfers.dest_account_id,
      cs.first_name || " " || cs.last_name AS source_account_name,
      cd.first_name || " " || cd.last_name AS dest_account_name
      FROM transfers
      INNER JOIN accounts AS source ON transfers.source_account_id = source.id
      INNER JOIN accounts AS dest ON transfers.dest_account_id = dest.id
      INNER JOIN customers AS cs ON source.customer_id =  cs.id 
      INNER JOIN customers AS cd ON dest.customer_id = cd.id
      LIMIT ? OFFSET ?`,
      [limit, offset],
      (err: Error | null, rows: TTransfer[]) => {
        if (err !== null) {
          reject(APIError(500, err.message))
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
      `
      SELECT transfers.id, transfers.timestamp, transfers.amount, transfers.status, transfers.source_account_id, transfers.dest_account_id,
      cs.first_name || " " || cs.last_name AS source_account_name,
      cd.first_name || " " || cd.last_name AS dest_account_name
      FROM transfers
      INNER JOIN accounts AS source ON transfers.source_account_id = source.id
      INNER JOIN accounts AS dest ON transfers.dest_account_id = dest.id
      INNER JOIN customers AS cs ON source.customer_id =  cs.id 
      INNER JOIN customers AS cd ON dest.customer_id = cd.id
      WHERE transfers.id = ?
      `,
      [id],
      (err: Error | null, row?: TTransfer) => {
        if (err !== null) {
          reject(APIError(500, `Error retrieving row: ${err.message}`))
        } else if (row !== undefined) {
          resolve(row)
        } else {
          reject(APIError(404, `Transfer ${id} not found`))
        }
      }
    )
  })
}

export default {
  getTransfers,
  getTransferById
}
