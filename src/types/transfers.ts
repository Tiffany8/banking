import y from 'yup'

export const Transfer = y.object({
  id: y.string().required(),
  timestamp: y.date().required(),
  amount: y.number().required(),
  status: y.string().required(),
  source_customer_name: y.string().required(),
  source_account_id: y.string().required(),
  destination_customer_name: y.string().required(),
  dest_account_id: y.string().required()
})

export type TTransfer = y.InferType<typeof Transfer>
