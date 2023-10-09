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

export type TBaseCustomer = y.InferType<typeof BaseCustomer>

export type TCustomer = y.InferType<typeof Customer>
