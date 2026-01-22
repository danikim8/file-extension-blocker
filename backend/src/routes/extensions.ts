import { Router, type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { normalizeExtension, validateExtension } from '../utils/validator'
import dotenv from 'dotenv'

// 환경변수 로드 (Prisma Client 생성 전에 필요)
dotenv.config()

const router = Router()

// Prisma 7: engine type \"client\" 사용 시 adapter 필요
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
})
const USER_ID = 'user_1'

// GET /fixed - 고정 확장자 조회
router.get('/fixed', async (req: Request, res: Response, next) => {
  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      })
    }

    const extensions = await prisma.fixedExtension.findMany({
      where: { userId: String(userId) },
      select: {
        name: true,
        isBlocked: true,
      },
    })

    res.json({
      success: true,
      data: extensions,
    })
  } catch (error) {
    next(error)
  }
})

// PUT /fixed - 고정 확장자 일괄 업데이트
router.put('/fixed', async (req: Request, res: Response, next) => {
  try {
    console.log('🔵 PUT /fixed')
    console.log('📦 Body:', JSON.stringify(req.body, null, 2))

    const { userId, extensions } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      })
    }

    if (!extensions || !Array.isArray(extensions)) {
      return res.status(400).json({
        success: false,
        error: 'extensions array is required',
      })
    }

    const results = await Promise.all(
      extensions.map(async (ext) => {
        const normalized = normalizeExtension(ext.name)

        return await prisma.fixedExtension.upsert({
          where: {
            userId_name: {
              userId: String(userId),
              name: normalized,
            },
          },
          update: {
            isBlocked: Boolean(ext.isBlocked),
          },
          create: {
            userId: String(userId),
            name: normalized,
            isBlocked: Boolean(ext.isBlocked),
          },
        })
      })
    )

    console.log('✅ Saved:', results.length)

    res.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error('❌ Error:', error)
    next(error)
  }
})

// GET /custom - 커스텀 확장자 조회
router.get('/custom', async (req: Request, res: Response, next) => {
  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      })
    }

    const extensions = await prisma.customExtension.findMany({
      where: { userId: String(userId) },
      orderBy: { createdAt: 'desc' },
    })

    res.json({
      success: true,
      data: extensions,
    })
  } catch (error) {
    next(error)
  }
})

// POST /custom - 커스텀 확장자 추가
router.post('/custom', async (req: Request, res: Response, next) => {
  try {
    const { userId, name } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      })
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'name is required',
      })
    }

    const normalized = normalizeExtension(name)
    const validation = validateExtension(normalized)

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      })
    }

    // Check count limit
    const count = await prisma.customExtension.count({
      where: { userId: String(userId) },
    })

    if (count >= 200) {
      return res.status(400).json({
        success: false,
        error: '최대 200개까지만 추가할 수 있습니다',
      })
    }

    // Check duplicate
    const existing = await prisma.customExtension.findFirst({
      where: {
        userId: String(userId),
        name: normalized,
      },
    })

    if (existing) {
      return res.status(400).json({
        success: false,
        error: '이미 존재하는 확장자입니다',
      })
    }

    const extension = await prisma.customExtension.create({
      data: {
        userId: String(userId),
        name: normalized,
      },
    })

    res.json({
      success: true,
      data: extension,
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /custom/:id - 커스텀 확장자 삭제
router.delete('/custom/:id', async (req: Request, res: Response, next) => {
  try {
    const id = String(req.params.id)
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      })
    }

    // Check if exists and belongs to user
    const extension = await prisma.customExtension.findFirst({
      where: {
        id,
        userId: String(userId),
      },
    })

    if (!extension) {
      return res.status(404).json({
        success: false,
        error: 'Extension not found',
      })
    }

    await prisma.customExtension.delete({
      where: { id },
    })

    res.json({
      success: true,
      message: 'Deleted',
    })
  } catch (error) {
    next(error)
  }
})

export default router
