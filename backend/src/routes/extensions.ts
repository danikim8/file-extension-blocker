import { Router, type Request, type Response } from 'express'
import { normalizeExtension, validateExtension } from '../utils/validator'
import prisma from '../config/prisma'

const router = Router()
const USER_ID = 'user_1'

/**
 * @swagger
 * /api/extensions/fixed:
 *   get:
 *     summary: 고정 확장자 조회
 *     tags: [Extensions]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FixedExtension'
 *       400:
 *         description: userId 필수
 */
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

/**
 * @swagger
 * /api/extensions/fixed:
 *   put:
 *     summary: 고정 확장자 일괄 저장
 *     tags: [Extensions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - extensions
 *             properties:
 *               userId:
 *                 type: string
 *                 example: user_1
 *               extensions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/FixedExtension'
 *     responses:
 *       200:
 *         description: 성공
 *       400:
 *         description: 잘못된 요청
 */
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

/**
 * @swagger
 * /api/extensions/custom:
 *   get:
 *     summary: 커스텀 확장자 조회
 *     tags: [Extensions]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CustomExtension'
 *       400:
 *         description: userId 필수
 */
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

/**
 * @swagger
 * /api/extensions/custom:
 *   post:
 *     summary: 커스텀 확장자 추가
 *     tags: [Extensions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - name
 *             properties:
 *               userId:
 *                 type: string
 *                 example: user_1
 *               name:
 *                 type: string
 *                 example: zip
 *     responses:
 *       201:
 *         description: 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CustomExtension'
 *       400:
 *         description: 잘못된 요청 (중복, 형식 오류, 200개 초과)
 */
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

    res.status(201).json({
      success: true,
      data: extension,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/extensions/custom/{id}:
 *   delete:
 *     summary: 커스텀 확장자 삭제
 *     tags: [Extensions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 확장자 ID
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 성공
 *       404:
 *         description: 확장자를 찾을 수 없음
 *       400:
 *         description: userId 필수
 */
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
