import { type FastifyInstance, type FastifyPluginOptions } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type YupTypeProvider
} from 'fastify-type-provider-yup'

import { type TAccount } from '../../types/accounts'

import { type TCreateAccountRequest } from './schema'

export default async (
  untyped: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  const fastify = untyped.withTypeProvider<YupTypeProvider>()
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  fastify.post<{ Body: TCreateAccountRequest; Reply: TAccount }>(
    '/',
    async (request, reply) => {
      const { body } = request
      const account = await accountlib.createAccount({
        db: fastify.db,
        body
      })
      return account
    }
  )

  await Promise.resolve()
}
