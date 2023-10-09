import { type FastifyInstance, type FastifyPluginOptions } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type YupTypeProvider
} from 'fastify-type-provider-yup'

import transferlib from '../../lib/transfersLib'
import { Transfer, type TTransfer } from '../../types/transfers'

import {
  GetTransferByIdRequestParams,
  GetTransfersRequestParams,
  type TGetTransferByIdRequest,
  type TGetTransfersRequest
} from './schema'

export default async (
  untyped: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  const fastify = untyped.withTypeProvider<YupTypeProvider>()
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  fastify.get<{
    Querystring: TGetTransfersRequest
    Reply: TTransfer[]
  }>(
    '/',
    {
      schema: {
        querystring: GetTransfersRequestParams
      }
    },
    async (request, reply) => {
      const { limit, offset } = request.query
      console.log('offset ', offset)
      console.log('limit ', limit)
      const transfers = await transferlib.getTransfers({
        db: fastify.db,
        limit,
        offset
      })
      return transfers
    }
  )

  fastify.get<{
    Params: TGetTransferByIdRequest
  }>(
    '/:id',
    {
      schema: {
        params: GetTransferByIdRequestParams,
        response: {
          200: Transfer
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params
      const transfer = await transferlib.getTransferById({
        db: fastify.db,
        id
      })
      return transfer
    }
  )
  await Promise.resolve()
}
