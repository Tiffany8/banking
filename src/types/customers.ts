import * as y from 'yup'

export const _Customer = y.object({
  first_name: y.string(),
  last_name: y.string(),
  email: y.string().email()
})

export const BaseCustomer = _Customer.shape({ date_of_birth: y.string() })

export const Customer = BaseCustomer.shape({
  id: y.number().required(),
  date_of_birth: y.date()
})
  .label('Customer')
  .example({
    id: 1,
    first_name: 'Alice',
    last_name: 'Walker',
    email: 'alice@walker.net',
    date_of_birth: '1944-02-09'
  })

export type TBaseCustomer = y.InferType<typeof BaseCustomer>

export type TCustomer = y.InferType<typeof Customer>
