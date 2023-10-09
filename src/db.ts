import type sqlite3 from 'sqlite3'

export const initDatabase = async (db: sqlite3.Database): Promise<void> => {
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
        customer_id INTEGER NOT NULL,
        routing_number TEXT,
        account_number TEXT,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
    );`,
    `CREATE TABLE IF NOT EXISTS transfers (
        id TEXT NOT NULL PRIMARY KEY,
        timestamp DATETIME NOT NULL,
        amount INTEGER NOT NULL,
        status TEXT NOT NULL,
        source_account_id INTEGER,
        dest_account_id INTEGER,
        FOREIGN KEY (source_account_id) REFERENCES accounts(id),
        FOREIGN KEY (dest_account_id) REFERENCES accounts(id)
    );`
  ]

  for (const query of queries) {
    await new Promise<void>((resolve, reject) => {
      db.run(query, (err) => {
        if (err != null) {
          reject(new Error(`Error initializing tables: ${err.message}`))
        } else {
          resolve()
        }
      })
    })
  }
}
