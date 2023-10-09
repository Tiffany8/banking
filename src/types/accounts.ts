import y from 'yup'

const BaseAccount = y.object({
  customer_id: y.number().required(),
  routing_number: y.string().nullable(),
  account_number: y.string().nullable()
})
export const Account = BaseAccount.shape({
  id: y.number().required()
})

export type TBaseAccount = y.InferType<typeof BaseAccount>
export type TAccount = y.InferType<typeof Account>
