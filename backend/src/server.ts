import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import extensionsRouter from './routes/extensions'
import { errorHandler } from './middleware/errorHandler'
import { swaggerSpec } from './config/swagger'

dotenv.config()

const app = express()

// 미들웨어 설정
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed or is a Vercel preview deployment
    if (allowedOrigins.some(allowed => 
      origin === allowed || 
      origin.endsWith('.vercel.app')
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 * @swagger
 * /health:
 *   get:
 *     summary: 서버 상태 확인
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: 서버 정상
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 */
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// 라우트 마운트
app.use('/api/extensions', extensionsRouter)

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not Found' })
})

// 에러 핸들러
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
