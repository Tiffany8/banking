import y from 'yup'

export const Transfer = y.object({
  id: y.string().required(),
  timestamp: y.date().required(),
  amount: y.number().required(),
  status: y.string(),
  source_account_id: y.string(),
  dest_account_id: y.string()
})

export type TTransfer = y.InferType<typeof Transfer>
