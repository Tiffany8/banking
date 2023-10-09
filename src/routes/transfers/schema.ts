import * as y from 'yup'

export const GetTransfersRequestParams = y.object({
  limit: y.number().default(100).label('Limit'),
  offset: y.number().default(0).label('Offset')
})
export type TGetTransfersRequest = y.InferType<typeof GetTransfersRequestParams>

export const GetTransferByIdRequestParams = y.object({
  id: y.string().required().label('Transfer ID')
})

export type TGetTransferByIdRequest = y.InferType<
  typeof GetTransferByIdRequestParams
>
