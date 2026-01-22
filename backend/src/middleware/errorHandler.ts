import type { Request, Response, NextFunction } from 'express'

// 글로벌 에러 핸들러 미들웨어
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Error]', err)

  const statusCode = (err && err.statusCode) || 500
  const message = (err && err.message) || 'Internal Server Error'

  res.status(statusCode).json({
    success: false,
    error: message,
  })
}
