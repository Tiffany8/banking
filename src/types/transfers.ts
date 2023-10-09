import y from 'yup'

const BaseTransfer = y.object({
  timestamp: y.string().required(),
  amount: y.number().required(),
  status: y.string().required(),
  source_account_id: y.number().required(),
  dest_account_id: y.number().required()
})

export const Transfer = BaseTransfer.shape({
  id: y.number().required(),
  source_account_name: y.string().required(),
  dest_account_name: y.string().required()
})

export type TBaseTransfer = y.InferType<typeof BaseTransfer>
export type TTransfer = y.InferType<typeof Transfer>
