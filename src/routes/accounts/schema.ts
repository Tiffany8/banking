import * as y from 'yup'

export const CreateAccountRequestBody = y.object({
  customer_id: y.string().required(),
  account_number: y.string().required(),
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
})

export type TCreateAccountRequest = y.InferType<typeof CreateAccountRequestBody>
