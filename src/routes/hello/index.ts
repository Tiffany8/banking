import {
  type FastifyInstance,
  type FastifyPluginOptions,
  type FastifyReply,
  type FastifyRequest
} from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type YupTypeProvider
} from 'fastify-type-provider-yup'

export default async (
  untyped: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  const fastify = untyped.withTypeProvider<YupTypeProvider>()
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  fastify.get(
    '/',
    async (
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<{ hello: string }> => {
      return { hello: 'world' }
    }
  )

  await Promise.resolve()
}
