import { type FastifyInstance } from 'fastify'

import { type TTransfer } from '../../types/transfers'
import { buildTestFastifyInstance } from '../testSetup'

describe('transfers endpoint', () => {
  let app: FastifyInstance
  let transfers: TTransfer[] = []

  beforeAll(async () => {
    app = await buildTestFastifyInstance()
    transfers = app.fixtures.get('transfers') as TTransfer[]
  })

  afterAll((done) => {
    app.db.close()
    done()
  })

  it('/transfers should return transfers with default query params', async () => {
    const resp = await app.inject({
      method: 'GET',
      url: '/transfers'
    })

    expect(resp.statusCode).toBe(200)
    expect(JSON.parse(resp.payload).length).toEqual(2)
  })

  it('/transfers should return transfers with defined offset and limit query params', async () => {
    const resp = await app.inject({
      method: 'GET',
      url: '/transfers',
      query: {
        offset: '0',
        limit: '1'
      }
    })

    expect(resp.statusCode).toBe(200)
    expect(JSON.parse(resp.payload).length).toEqual(1)
  })

  it('/transfers/:id should return transfer', async () => {
    const resp = await app.inject({
      method: 'GET',
      url: `/transfers/${transfers[0].id}`
    })

    expect(resp.statusCode).toBe(200)
    expect(JSON.parse(resp.payload).id).toEqual(transfers[0].id)
  })

  it('/transfers/:id should raise 404 on unknown transfer id', async () => {
    const resp = await app.inject({
      method: 'GET',
      url: '/transfers/1234'
    })

    expect(resp.statusCode).toBe(404)
    expect(resp.statusMessage).toBe('Not Found')
    expect(resp.json().message).toBe('Transfer 1234 not found')
  })
})
