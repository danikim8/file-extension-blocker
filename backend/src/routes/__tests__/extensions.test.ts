import request from 'supertest'
import express from 'express'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { PrismaClient } from '@prisma/client'
import extensionsRouter from '../extensions'
import { errorHandler } from '../../middleware/errorHandler'
import prisma from '../../config/prisma'

// Prisma 모킹
jest.mock('../../config/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

const mockedPrisma = prisma as unknown as DeepMockProxy<PrismaClient>

const app = express()
app.use(express.json())
app.use('/api/extensions', extensionsRouter)
app.use(errorHandler)

const TEST_USER_ID = 'test_user_123'

describe('GET /api/extensions/fixed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('성공: 고정 확장자 조회', async () => {
    mockedPrisma.fixedExtension.findMany.mockResolvedValue([
      {
        id: 'test-id-1',
        userId: TEST_USER_ID,
        name: 'exe',
        isBlocked: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'test-id-2',
        userId: TEST_USER_ID,
        name: 'bat',
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as any)

    const response = await request(app)
      .get('/api/extensions/fixed')
      .query({ userId: TEST_USER_ID })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(mockedPrisma.fixedExtension.findMany).toHaveBeenCalledWith({
      where: { userId: TEST_USER_ID },
      select: {
        name: true,
        isBlocked: true,
      },
    })
  })

  test('400: userId 누락', async () => {
    const response = await request(app)
      .get('/api/extensions/fixed')

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('userId is required')
  })

  test('500: 데이터베이스 에러', async () => {
    mockedPrisma.fixedExtension.findMany.mockRejectedValue(
      new Error('Database connection failed')
    )

    const response = await request(app)
      .get('/api/extensions/fixed')
      .query({ userId: TEST_USER_ID })

    expect(response.status).toBe(500)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('Database connection failed')
  })
})

describe('PUT /api/extensions/fixed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('성공: 고정 확장자 저장', async () => {
    mockedPrisma.fixedExtension.upsert.mockResolvedValue({
      id: 'test-id',
      userId: TEST_USER_ID,
      name: 'exe',
      isBlocked: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const response = await request(app)
      .put('/api/extensions/fixed')
      .send({
        userId: TEST_USER_ID,
        extensions: [
          { name: 'exe', isBlocked: true },
          { name: 'bat', isBlocked: false },
        ],
      })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data)).toBe(true)
  })

  test('400: userId 누락', async () => {
    const response = await request(app)
      .put('/api/extensions/fixed')
      .send({
        extensions: [{ name: 'exe', isBlocked: true }],
      })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('userId is required')
  })

  test('400: extensions 배열 누락', async () => {
    const response = await request(app)
      .put('/api/extensions/fixed')
      .send({
        userId: TEST_USER_ID,
      })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('extensions array is required')
  })

  test('500: 데이터베이스 에러', async () => {
    mockedPrisma.fixedExtension.upsert.mockRejectedValue(
      new Error('Database connection failed')
    )

    const response = await request(app)
      .put('/api/extensions/fixed')
      .send({
        userId: TEST_USER_ID,
        extensions: [{ name: 'exe', isBlocked: true }],
      })

    expect(response.status).toBe(500)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('Database connection failed')
  })
})

describe('GET /api/extensions/custom', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('성공: 커스텀 확장자 조회', async () => {
    mockedPrisma.customExtension.findMany.mockResolvedValue([
      {
        id: 'test-id-1',
        userId: TEST_USER_ID,
        name: 'zip',
        createdAt: new Date(),
      },
    ])

    const response = await request(app)
      .get('/api/extensions/custom')
      .query({ userId: TEST_USER_ID })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data)).toBe(true)
  })

  test('400: userId 누락', async () => {
    const response = await request(app)
      .get('/api/extensions/custom')

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('userId is required')
  })

  test('500: 데이터베이스 에러', async () => {
    mockedPrisma.customExtension.findMany.mockRejectedValue(
      new Error('Database connection failed')
    )

    const response = await request(app)
      .get('/api/extensions/custom')
      .query({ userId: TEST_USER_ID })

    expect(response.status).toBe(500)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('Database connection failed')
  })
})

describe('POST /api/extensions/custom', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('성공: 커스텀 확장자 추가', async () => {
    mockedPrisma.customExtension.count.mockResolvedValue(0)
    mockedPrisma.customExtension.findFirst.mockResolvedValue(null)
    mockedPrisma.customExtension.create.mockResolvedValue({
      id: 'test-id',
      userId: TEST_USER_ID,
      name: 'zip',
      createdAt: new Date(),
    })

    const response = await request(app)
      .post('/api/extensions/custom')
      .send({
        userId: TEST_USER_ID,
        name: 'zip',
      })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveProperty('id')
    expect(response.body.data).toHaveProperty('name')
  })

  test('400: userId 누락', async () => {
    const response = await request(app)
      .post('/api/extensions/custom')
      .send({
        name: 'zip',
      })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('userId is required')
  })

  test('400: name 누락', async () => {
    const response = await request(app)
      .post('/api/extensions/custom')
      .send({
        userId: TEST_USER_ID,
      })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('name is required')
  })

  test('400: 잘못된 형식 (특수문자)', async () => {
    const response = await request(app)
      .post('/api/extensions/custom')
      .send({
        userId: TEST_USER_ID,
        name: 'abc@#$',
      })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toContain('영문 소문자')
  })

  test('400: 길이 초과', async () => {
    const response = await request(app)
      .post('/api/extensions/custom')
      .send({
        userId: TEST_USER_ID,
        name: 'a'.repeat(21),
      })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toContain('20자')
  })

  test('400: 200개 초과', async () => {
    mockedPrisma.customExtension.count.mockResolvedValue(200)

    const response = await request(app)
      .post('/api/extensions/custom')
      .send({
        userId: TEST_USER_ID,
        name: 'zip',
      })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toContain('200개')
  })

  test('409: 중복 확장자', async () => {
    mockedPrisma.customExtension.count.mockResolvedValue(0)
    mockedPrisma.customExtension.findFirst.mockResolvedValue({
      id: 'existing-id',
      userId: TEST_USER_ID,
      name: 'zip',
      createdAt: new Date(),
    })

    const response = await request(app)
      .post('/api/extensions/custom')
      .send({
        userId: TEST_USER_ID,
        name: 'zip',
      })

    expect(response.status).toBe(409)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('이미 존재하는 확장자입니다')
  })

  test('409: 대소문자 무관 중복', async () => {
    // 'zip' 추가 후 'ZIP' 시도
    mockedPrisma.customExtension.count.mockResolvedValue(0)
    mockedPrisma.customExtension.findFirst.mockResolvedValue({
      id: 'existing-id',
      userId: TEST_USER_ID,
      name: 'zip', // 이미 소문자로 저장됨
      createdAt: new Date(),
    })

    const response = await request(app)
      .post('/api/extensions/custom')
      .send({
        userId: TEST_USER_ID,
        name: 'ZIP', // 대문자로 시도
      })

    expect(response.status).toBe(409)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('이미 존재하는 확장자입니다')
  })

  test('500: 데이터베이스 에러 (create)', async () => {
    mockedPrisma.customExtension.count.mockResolvedValue(0)
    mockedPrisma.customExtension.findFirst.mockResolvedValue(null)
    mockedPrisma.customExtension.create.mockRejectedValue(
      new Error('Database connection failed')
    )

    const response = await request(app)
      .post('/api/extensions/custom')
      .send({
        userId: TEST_USER_ID,
        name: 'zip',
      })

    expect(response.status).toBe(500)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('Database connection failed')
  })

  test('500: 데이터베이스 에러 (count)', async () => {
    mockedPrisma.customExtension.count.mockRejectedValue(
      new Error('Database connection failed')
    )

    const response = await request(app)
      .post('/api/extensions/custom')
      .send({
        userId: TEST_USER_ID,
        name: 'zip',
      })

    expect(response.status).toBe(500)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('Database connection failed')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})

describe('DELETE /api/extensions/custom/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('400: userId 누락', async () => {
    const response = await request(app)
      .delete('/api/extensions/custom/some-id')

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('userId is required')
  })

  test('404: 존재하지 않는 확장자', async () => {
    mockedPrisma.customExtension.findFirst.mockResolvedValue(null)

    const response = await request(app)
      .delete('/api/extensions/custom/invalid-id-12345')
      .query({ userId: TEST_USER_ID })

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('Extension not found')
  })

  test('성공: 커스텀 확장자 삭제', async () => {
    mockedPrisma.customExtension.findFirst.mockResolvedValue({
      id: 'test-id',
      userId: TEST_USER_ID,
      name: 'zip',
      createdAt: new Date(),
    })
    mockedPrisma.customExtension.delete.mockResolvedValue({
      id: 'test-id',
      userId: TEST_USER_ID,
      name: 'zip',
      createdAt: new Date(),
    })

    const response = await request(app)
      .delete('/api/extensions/custom/test-id')
      .query({ userId: TEST_USER_ID })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Deleted')
  })

  test('500: 데이터베이스 에러 (findFirst)', async () => {
    mockedPrisma.customExtension.findFirst.mockRejectedValue(
      new Error('Database connection failed')
    )

    const response = await request(app)
      .delete('/api/extensions/custom/test-id')
      .query({ userId: TEST_USER_ID })

    expect(response.status).toBe(500)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('Database connection failed')
  })

  test('500: 데이터베이스 에러 (delete)', async () => {
    mockedPrisma.customExtension.findFirst.mockResolvedValue({
      id: 'test-id',
      userId: TEST_USER_ID,
      name: 'zip',
      createdAt: new Date(),
    })
    mockedPrisma.customExtension.delete.mockRejectedValue(
      new Error('Database connection failed')
    )

    const response = await request(app)
      .delete('/api/extensions/custom/test-id')
      .query({ userId: TEST_USER_ID })

    expect(response.status).toBe(500)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('Database connection failed')
  })
})
