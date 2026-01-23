import { Request, Response, NextFunction } from 'express'
import { errorHandler } from '../errorHandler'

describe('errorHandler', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
    mockNext = jest.fn()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  test('기본 에러 처리 (500)', () => {
    const error = new Error('Something went wrong')

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext)

    expect(consoleErrorSpy).toHaveBeenCalledWith('[Error]', error)
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: 'Something went wrong',
    })
  })

  test('statusCode가 있는 에러 처리', () => {
    const error: any = new Error('Bad Request')
    error.statusCode = 400

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext)

    expect(consoleErrorSpy).toHaveBeenCalledWith('[Error]', error)
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: 'Bad Request',
    })
  })

  test('메시지가 없는 에러 처리', () => {
    const error: any = {}

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext)

    expect(consoleErrorSpy).toHaveBeenCalledWith('[Error]', error)
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: 'Internal Server Error',
    })
  })

  test('statusCode와 message가 모두 없는 에러 처리', () => {
    const error: any = { someProperty: 'value' }

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext)

    expect(consoleErrorSpy).toHaveBeenCalledWith('[Error]', error)
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: 'Internal Server Error',
    })
  })
})
