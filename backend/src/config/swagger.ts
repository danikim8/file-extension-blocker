import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '파일 확장자 차단 API',
      version: '1.0.0',
      description: '파일 확장자 차단 관리 시스템 API 문서',
      contact: {
        name: '김단이',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: '로컬 개발 서버',
      },
      {
        url: 'https://file-extension-blocker-pf9s.onrender.com',
        description: '프로덕션 서버',
      },
    ],
    components: {
      schemas: {
        FixedExtension: {
          type: 'object',
          required: ['name', 'isBlocked'],
          properties: {
            name: {
              type: 'string',
              example: 'exe',
              description: '확장자 이름',
            },
            isBlocked: {
              type: 'boolean',
              example: true,
              description: '차단 여부',
            },
          },
        },
        CustomExtension: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clx1234567890',
              description: '확장자 ID',
            },
            userId: {
              type: 'string',
              example: 'user_1',
              description: '사용자 ID',
            },
            name: {
              type: 'string',
              example: 'zip',
              description: '확장자 이름',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '생성 시간',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            data: {
              type: 'object',
            },
            error: {
              type: 'string',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/server.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
