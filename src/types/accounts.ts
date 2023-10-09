import * as y from 'yup'

const BaseAccount = y.object({
  customer_id: y.string().required(),
  routing_number: y.string().nullable(),
  account_number: y.string().nullable()
})
export const Account = BaseAccount.shape({
  id: y.string().required()
})

export type TBaseAccount = y.InferType<typeof BaseAccount>
export type TAccount = y.InferType<typeof Account>
