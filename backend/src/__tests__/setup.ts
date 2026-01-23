// Jest 테스트 환경 설정
import dotenv from 'dotenv'

// 테스트용 환경변수 로드
dotenv.config({ path: '.env.test' })

// Prisma Client 초기화 지연
beforeAll(async () => {
  // 테스트 전 초기화 작업
})

afterAll(async () => {
  // 테스트 후 정리 작업
})
