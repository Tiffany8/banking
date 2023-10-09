import * as y from 'yup'

export const GetTransfersRequestParams = y.object({
  limit: y.number().default(100),
  offset: y.number().default(0)
})
export type TGetTransfersRequest = y.InferType<typeof GetTransfersRequestParams>

export const GetTransferByIdRequestParams = y.object({
  id: y.string().required()
})

export type TGetTransferByIdRequest = y.InferType<
  typeof GetTransferByIdRequestParams
>
