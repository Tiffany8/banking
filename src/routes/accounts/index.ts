import { type FastifyInstance, type FastifyPluginOptions } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type YupTypeProvider
} from 'fastify-type-provider-yup'

import accountlib from '../../lib/accountsLib'
import { type TAccount } from '../../types/accounts'

import { CreateAccountRequestBody, type TCreateAccountRequest } from './schema'

export default async (
  untyped: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  const fastify = untyped.withTypeProvider<YupTypeProvider>()
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  fastify.post<{ Body: TCreateAccountRequest; Reply: TAccount }>(
    '/',
    {
      schema: {
        body: CreateAccountRequestBody
      }
    },
    async (request, reply) => {
      const {
        customer_id: customerId,
        account_number: accountNumber,
        routing_number: routingNumber
      } = request.body
      const account = await accountlib.insertAccount({
        db: fastify.db,
        customerId,
        accountNumber,
        routingNumber
      })
      return account
    }
  )

  await Promise.resolve()
}
