import y from 'yup'

export const Account = y.object({
  id: y.string().required(),
  customer_id: y.string().required(),
  routing_number: y.string().nullable(),
  account_number: y.string().nullable()
})

export type TAccount = y.InferType<typeof Account>
