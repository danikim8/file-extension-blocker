export interface FixedExtension {
  name: string
  isBlocked: boolean
}

export interface CustomExtension {
  id: string
  name: string
  createdAt?: string
}

export interface TestResult {
  fileName: string
  extension: string
  isBlocked: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
