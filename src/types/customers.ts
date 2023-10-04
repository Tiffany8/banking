import * as y from 'yup'

export const Customer = y.object({
  id: y.string().required(),
  first_name: y.string(),
  last_name: y.string(),
  date_of_birth: y.date(),
  email: y.string().email()
})
export type TCustomer = y.InferType<typeof Customer>
