import * as y from 'yup'

const BaseTransfer = y.object({
  id: y.string().required(),
  timestamp: y.string().required(),
  amount: y.number().required(),
  status: y.string().required(),
  source_account_id: y.string().required(),
  dest_account_id: y.string().required()
})

export const Transfer = y.object({
  id: y.string().required(),
  timestamp: y.string().required(),
  amount: y.number().required(),
  status: y.string().required(),
  source_account_id: y.string().required(),
  dest_account_id: y.string().required(),
  source_account_name: y.string().required(),
  dest_account_name: y.string().required()
})

export type TBaseTransfer = y.InferType<typeof BaseTransfer>
export type TTransfer = y.InferType<typeof Transfer>
