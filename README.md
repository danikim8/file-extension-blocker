<p align="center">
  <img src="frontend/public/screenshot.png" alt="파일확장자차단앱" width="100%" />
</p>

<h1 align="center">🛡️ File Extension Blocker</h1>
<h3 align="center">위험한 파일 확장자를 차단하여 보안을 강화하는 웹 애플리케이션</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Tests-27%20passed-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Coverage-85%25-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/CI%2FCD-Passing-success?style=for-the-badge" />
</p>

<p align="center">
  <a href="https://blocker-dani.vercel.app">🌐 Live Demo</a> •
  <a href="https://file-extension-blocker-pf9s.onrender.com/api-docs">📚 API Docs</a> •
  <a href="https://github.com/danikim8/file-extension-blocker">💻 GitHub</a>
</p>

---

## 목차

1. [프로젝트 소개](#1-프로젝트-소개)
2. [주요 기능](#2-주요-기능)
3. [기술 스택](#3-기술-스택)
4. [시작하기](#4-시작하기)
5. [API 엔드포인트](#5-api-엔드포인트)
6. [테스트](#6-테스트)
7. [CI/CD](#7-cicd)
8. [트러블슈팅](#8-트러블슈팅)
9. [폴더 구조](#9-폴더-구조)

---

## 1. 프로젝트 소개

**파일 확장자 차단 앱**은 위험한 파일 확장자를 관리하고 차단하여 시스템 보안을 강화하는 웹 애플리케이션입니다.

사용자별로 독립적인 확장자 설정을 관리하며, 실시간 파일 검증 기능을 제공합니다.

---

## 2. 주요 기능

### 🔒 고정 확장자 관리
- 7개의 위험한 고정 확장자 제공: `bat`, `cmd`, `com`, `cpl`, `exe`, `scr`, `js`
- 체크박스로 개별 차단 설정 및 일괄 저장

### ➕ 커스텀 확장자 관리
- 최대 200개까지 사용자 정의 확장자 추가 가능
- 실시간 입력 검증 (영문 소문자, 숫자, 언더스코어만 허용, 최대 20자)
- 대소문자 무관 중복 체크

### 📤 파일 업로드 테스트
- 드래그 앤 드롭 지원
- 차단 목록과 실시간 비교 후 토스트 알림

### 👤 사용자 관리
- LocalStorage 기반 사용자 ID 자동 생성
- 사용자별 독립적인 확장자 설정

---

## 3. 기술 스택

### Frontend
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.2.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-30.2.0-C21325?style=for-the-badge&logo=jest&logoColor=white)

### DevOps
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deploy-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## 4. 시작하기

### 사전 요구사항
- Node.js 22 이상
- PostgreSQL 데이터베이스 (Supabase 권장)

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/danikim8/file-extension-blocker.git
cd file-extension-blocker

# Backend 설정
cd backend
npm install
# .env 파일 생성 후 DATABASE_URL, DIRECT_URL, PORT 설정
npx prisma migrate dev
npm run dev

# Frontend 설정 (새 터미널)
cd frontend
npm install
# .env 파일 생성 후 VITE_API_URL 설정
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

---

## 5. API 엔드포인트

### Base URL
- **프로덕션**: `https://file-extension-blocker-pf9s.onrender.com`

### 주요 엔드포인트

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | 서버 상태 확인 |
| `GET` | `/api/extensions/fixed` | 고정 확장자 조회 |
| `PUT` | `/api/extensions/fixed` | 고정 확장자 저장 |
| `GET` | `/api/extensions/custom` | 커스텀 확장자 조회 |
| `POST` | `/api/extensions/custom` | 커스텀 확장자 추가 |
| `DELETE` | `/api/extensions/custom/:id` | 커스텀 확장자 삭제 |
| `GET` | `/api-docs` | Swagger API 문서 |

자세한 API 스펙은 [Swagger UI](https://file-extension-blocker-pf9s.onrender.com/api-docs)에서 확인 가능합니다.

---

## 6. 테스트

### ✅ 27개 테스트 전체 통과 (100%)

#### Unit Tests (9개)
- `normalizeExtension`: 공백/점 제거, 소문자 변환
- `validateExtension`: 형식/길이/경계값 검증

#### Integration Tests (18개)
- 고정 확장자 조회/저장
- 커스텀 확장자 CRUD
- 대소문자 무관 중복 체크
- 200개 제한 검증
- 에러 핸들링

### 테스트 실행

```bash
cd backend

npm test              # 전체 테스트
npm run test:coverage # 커버리지 (85%+)
npm run type-check    # 타입 체크
```

---

## 7. CI/CD

### GitHub Actions

**main 브랜치 푸시 시 자동 실행:**

- ✅ Backend: Jest 테스트 27개 + TypeScript 타입 체크
- ✅ Frontend: 프로덕션 빌드 + TypeScript 타입 체크

### 배포 프로세스

```
코드 작성 → main 푸시 → GitHub Actions 테스트
    ↓
테스트 통과 → Vercel/Render 자동 배포 → 배포 완료 ✅
```

**배포 환경:**
- Frontend: Vercel (main 브랜치 자동 배포)
- Backend: Render (main 브랜치 자동 배포)
- Database: Supabase (PostgreSQL)

---

## 8. 트러블슈팅

<details>
<summary><strong>Prisma 7 Adapter 마이그레이션</strong></summary>

### Problem
Prisma 7에서 `@prisma/adapter-pg` 필수 사용으로 변경, Supabase Session mode 연결 실패

### Solution
```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
```

### Result
✅ Supabase Session mode 연결 성공  
✅ 안정적인 연결 풀 관리

</details>

<details>
<summary><strong>Render 배포 시 TypeScript 컴파일 오류</strong></summary>

### Problem
테스트 파일(`*.test.ts`)이 컴파일 대상에 포함되어 빌드 실패

### Solution
```json
// tsconfig.json
{
  "exclude": [
    "node_modules",
    "**/*.test.ts",
    "**/__tests__/**"
  ]
}
```

### Result
✅ Render 빌드 성공  
✅ 빌드 시간 단축

</details>

<details>
<summary><strong>대소문자 무관 중복 체크 구현</strong></summary>

### Problem
`pdf`와 `PDF`를 다른 값으로 인식

### Solution
```typescript
export function normalizeExtension(ext: string): string {
  return ext.trim().replace(/^\.+/, '').toLowerCase();
}

// API에서 정규화 적용
const normalizedName = normalizeExtension(name);
const existing = await prisma.customExtension.findFirst({
  where: { userId, name: normalizedName }
});
```

### Result
✅ `pdf`, `PDF`, `.PDF` 모두 동일하게 처리  
✅ 데이터베이스에 항상 소문자로 저장

</details>

<details>
<summary><strong>Prisma Singleton 패턴 적용</strong></summary>

### Problem
여러 파일에서 `new PrismaClient()`를 각각 생성하여 연결 풀 낭비 및 테스트 시 모킹 어려움

### Solution
**1. Singleton 패턴으로 Prisma Client 중앙 관리**
```typescript
// backend/src/config/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
});

export default prisma;
```

**2. 모든 라우트에서 동일한 인스턴스 사용**
```typescript
// backend/src/routes/extensions.ts
import prisma from '../config/prisma';

// 여러 엔드포인트에서 동일한 prisma 인스턴스 사용
router.get('/fixed', async (req, res) => {
  const extensions = await prisma.fixedExtension.findMany({...});
});
```

**3. 테스트에서 모킹 용이**
```typescript
// backend/src/routes/__tests__/extensions.test.ts
import prisma from '../../config/prisma';

jest.mock('../../config/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const mockedPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;
```

### Result
✅ 단일 Prisma Client 인스턴스로 연결 풀 효율적 관리  
✅ 테스트에서 `jest-mock-extended`로 쉽게 모킹 가능  
✅ 코드 중복 제거 및 유지보수성 향상  
✅ 실제 DB 없이 테스트 가능

</details>

---

## 9. 폴더 구조

```bash
file-extension-blocker/
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/      # React 컴포넌트
│   │   ├── 📁 hooks/           # Custom Hooks
│   │   ├── 📁 services/        # API 서비스
│   │   ├── 📁 types/            # TypeScript 타입
│   │   ├── 📁 utils/            # 유틸리티
│   │   └── App.tsx
│   └── 📁 public/               # 정적 파일
│
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 routes/          # API 라우트
│   │   ├── 📁 config/          # Prisma, Swagger
│   │   ├── 📁 middleware/      # 에러 핸들러
│   │   ├── 📁 utils/           # Validator
│   │   └── server.ts
│   └── 📁 prisma/              # Schema & Migrations
│
└── 📁 .github/workflows/       # CI/CD
```

---

## 👤 개발자

**김단이**
- Portfolio: [portfolio-danikim.vercel.app](https://portfolio-danikim.vercel.app)
- GitHub: [@danikim8](https://github.com/danikim8)

---

<p align="center">
  Made with 💜 by Dani Kim
</p>
