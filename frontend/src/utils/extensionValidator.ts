/**
 * 확장자 정규화 함수
 * - 앞뒤 공백 제거
 * - 앞의 점(.) 제거
 * - 소문자 변환
 */
export function normalizeExtension(input: string): string {
  return input.trim().replace(/^\.+/, '').toLowerCase()
}
