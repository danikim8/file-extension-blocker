import { normalizeExtension, validateExtension } from '../validator'

describe('normalizeExtension', () => {
  test('공백 제거', () => {
    expect(normalizeExtension('  exe  ')).toBe('exe')
  })

  test('앞의 점 제거', () => {
    expect(normalizeExtension('.exe')).toBe('exe')
    expect(normalizeExtension('...exe')).toBe('exe')
  })

  test('대문자를 소문자로 변환', () => {
    expect(normalizeExtension('EXE')).toBe('exe')
    expect(normalizeExtension('Zip')).toBe('zip')
  })

  test('복합 케이스', () => {
    expect(normalizeExtension('  .PDF  ')).toBe('pdf')
    expect(normalizeExtension('...ZIP')).toBe('zip')
  })
})

describe('validateExtension', () => {
  test('빈 문자열 검증', () => {
    const result = validateExtension('')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('확장자를 입력해주세요')
  })

  test('길이 초과 검증 (20자 초과)', () => {
    const longExt = 'a'.repeat(21)
    const result = validateExtension(longExt)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('확장자는 최대 20자까지 입력 가능합니다')
  })

  test('유효한 확장자 (소문자, 숫자, 언더스코어)', () => {
    expect(validateExtension('exe').valid).toBe(true)
    expect(validateExtension('zip').valid).toBe(true)
    expect(validateExtension('pdf').valid).toBe(true)
    expect(validateExtension('mp4').valid).toBe(true)
    expect(validateExtension('file_123').valid).toBe(true)
    expect(validateExtension('a1b2c3').valid).toBe(true)
  })

  test('잘못된 형식 검증', () => {
    const invalidCases = [
      'EXE',      // 대문자
      'exe.exe',  // 점 포함
      'exe-',     // 하이픈
      'exe@',     // 특수문자
      'exe zip',  // 공백
      'exe!',     // 느낌표
    ]

    invalidCases.forEach(ext => {
      const result = validateExtension(ext)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('영문 소문자, 숫자, 언더스코어(_)만 입력 가능합니다')
    })
  })

  test('경계값 테스트', () => {
    // 정확히 20자
    const valid20 = 'a'.repeat(20)
    expect(validateExtension(valid20).valid).toBe(true)

    // 1자
    expect(validateExtension('a').valid).toBe(true)

    // 21자 (초과)
    const invalid21 = 'a'.repeat(21)
    expect(validateExtension(invalid21).valid).toBe(false)
  })
})
