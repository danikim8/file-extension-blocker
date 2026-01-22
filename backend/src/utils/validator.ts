/**
 * 확장자 문자열 정규화
 * - 공백 제거
 * - 앞의 점(.) 제거
 * - 소문자 변환
 */
export function normalizeExtension(input: string): string {
  return input.trim().replace(/^\.+/, '').toLowerCase()
}

/**
 * 확장자 유효성 검증
 * - 길이: 1-20자
 * - 형식: 영문 소문자, 숫자, 언더스코어만
 */
export function validateExtension(ext: string): { valid: boolean; error?: string } {
  if (!ext || ext.length === 0) {
    return { valid: false, error: '확장자를 입력해주세요' }
  }
  
  if (ext.length > 20) {
    return { valid: false, error: '확장자는 최대 20자까지 입력 가능합니다' }
  }
  
  const regex = /^[a-z0-9_]+$/
  if (!regex.test(ext)) {
    return { valid: false, error: '영문 소문자, 숫자, 언더스코어(_)만 입력 가능합니다' }
  }
  
  return { valid: true }
}
