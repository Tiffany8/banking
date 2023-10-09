import * as y from 'yup'

const BaseAccount = y.object({
  customer_id: y.number().required(),
  routing_number: y.string().nullable(),
  account_number: y.string().nullable()
})
export const Account = BaseAccount.shape({
  id: y.number().required()
})
  .label('Account')
  .example({
    customer_id: 1,
    routing_number: '813938796',
    account_number: '72302282'
  })

export type TBaseAccount = y.InferType<typeof BaseAccount>
export type TAccount = y.InferType<typeof Account>
