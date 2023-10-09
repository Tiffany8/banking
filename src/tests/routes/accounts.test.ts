import { type FastifyInstance } from 'fastify'

import { type TCustomer } from '../../types/customers'
import { buildTestFastifyInstance } from '../testSetup'

describe('accounts endpoint', () => {
  let app: FastifyInstance
  let customer: TCustomer
  const validRoutingNumber = '951655876'

  beforeAll(async () => {
    app = await buildTestFastifyInstance()
    const customers = app.fixtures.get('customers')
    if (customers != null && customers.length > 0) {
      customer = customers[0]
    }
  })

  afterAll((done) => {
    app.db.close()
    done()
  })

  it('should create an account', async () => {
    const resp = await app.inject({
      method: 'POST',
      url: '/accounts',
      body: {
        customer_id: customer.id,
        account_number: '123456789',
        routing_number: validRoutingNumber
      }
    })

    const account = JSON.parse(resp.payload)
    expect(resp.statusCode).toBe(200)
    expect(account.id).toBeDefined()
    expect(account.customer_id).toBe(customer.id)
    expect(account.account_number).toBe('123456789')
    expect(account.routing_number).toBe(validRoutingNumber)
  })

  it('should raise 404 on unknown customer_id', async () => {
    const resp = await app.inject({
      method: 'POST',
      url: '/accounts',
      body: {
        customer_id: 1234,
        account_number: '123456789',
        routing_number: validRoutingNumber
      }
    })

    expect(resp.statusCode).toBe(404)
    expect(resp.statusMessage).toBe('Not Found')
    expect(resp.json().message).toBe('Customer 1234 not found')
  })

  it('should raise 400 on invaid routing number', async () => {
    const resp = await app.inject({
      method: 'POST',
      url: '/accounts',
      body: {
        customer_id: 1,
        account_number: '123456789',
        routing_number: '123456789'
      }
    })

    expect(resp.statusCode).toBe(400)
    expect(resp.statusMessage).toBe('Bad Request')
    expect(resp.json().message).toBe('Invalid routing number')
  })
})
