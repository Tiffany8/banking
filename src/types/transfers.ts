import * as y from 'yup'

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
  .label('Transfer')
  .example({
    id: 1,
    timestamp: '1986-01-01T00:00:00.000Z',
    amount: 100,
    status: 'pending',
    source_account_id: 1,
    dest_account_id: 2,
    source_account_name: 'Alice Walker',
    dest_account_name: 'August Wilson'
  })

export type TBaseTransfer = y.InferType<typeof BaseTransfer>
export type TTransfer = y.InferType<typeof Transfer>
