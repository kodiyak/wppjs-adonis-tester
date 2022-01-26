export function createHttpResponse<T>(v: HttpResponse<T>) {
  return v
}

export interface HttpResponse<T> {
  statusCode: number
  message?: string
  data?: T
  status: 'success' | 'error'
}
