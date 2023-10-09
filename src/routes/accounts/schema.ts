import * as y from 'yup'

export const CreateAccountRequestBody = y
  .object({
    customer_id: y
      .number()
      .required()
      .label('Customer ID')
      .description('The ID of the customer who owns this account'),
    account_number: y
      .string()
      .required()
      .label('Routing Number')
      .description('The routing number of the bank where this account is held'),
    routing_number: y
      .string()
      .required()
      .test('routing_number', 'Invalid routing number', (value) => {
        const digits = value.split('').map(Number)
        const checksum =
          (3 * (digits[0] + digits[3] + digits[6]) +
            7 * (digits[1] + digits[4] + digits[7]) +
            (digits[2] + digits[5] + digits[8])) %
          10
        return checksum === 0
      })
      .label('Account Number')
      .description('The account number of this account')
  })
  .example({
    customer_id: 1,
    routing_number: '813938796',
    account_number: '72302282'
  })

export type TCreateAccountRequest = y.InferType<typeof CreateAccountRequestBody>
