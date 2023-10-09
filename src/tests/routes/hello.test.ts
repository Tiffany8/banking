import { type FastifyInstance } from 'fastify'

import { buildTestFastifyInstance } from '../testSetup'

describe('hello endpoint', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = await buildTestFastifyInstance()
  })

  afterEach((done) => {
    app.db.close((err) => {
      if (err !== null) {
        done(err)
      } else {
        done()
      }
    })
  })

  it('should greet the world', async () => {
    const resp = await app.inject({
      method: 'GET',
      url: '/hello'
    })

    expect(resp.statusCode).toBe(200)
    expect(JSON.parse(resp.payload)).toEqual({ hello: 'world' })
  })
})

test('hello world', () => {
  expect(1 + 1).toBe(2)
})
