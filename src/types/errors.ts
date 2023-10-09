export const APIError = (
  statusCode: number,
  message: string
): Error & { statusCode: number } =>
  Object.assign(new Error(message), { statusCode })
