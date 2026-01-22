/**
 * 확장자 정규화 함수
 * - 앞뒤 공백 제거
 * - 앞의 점(.) 제거
 * - 소문자 변환
 */
export function normalizeExtension(input: string): string {
  return input.trim().replace(/^\.+/, '').toLowerCase()
}

/**
 * 확장자 검증 함수
 * @param ext - 검증할 확장자
 * @param existingExtensions - 이미 존재하는 확장자 목록
 * @param currentCount - 현재 커스텀 확장자 개수
 * @returns 에러 메시지 또는 null (유효한 경우)
 */
export function validateExtension(
  ext: string,
  existingExtensions: string[],
  currentCount: number
): string | null {
  // 빈 값 체크
  if (!ext || ext.trim().length === 0) {
    return '확장자를 입력해주세요'
  }

  // 길이 체크 (최대 20자)
  if (ext.length > 20) {
    return '확장자는 최대 20자까지 입력 가능합니다'
  }

  // 정규식 체크: 영문 소문자, 숫자, 언더스코어만 허용
  const regex = /^[a-z0-9_]+$/
  if (!regex.test(ext)) {
    return '영문 소문자, 숫자, 언더스코어(_)만 입력 가능합니다'
  }

  // 중복 체크
  const normalized = normalizeExtension(ext)
  if (existingExtensions.some(existing => normalizeExtension(existing) === normalized)) {
    return '이미 차단 목록에 존재하는 확장자입니다'
  }

  // 개수 제한 체크 (최대 200개)
  if (currentCount >= 200) {
    return '커스텀 확장자는 최대 200개까지 추가 가능합니다'
  }

  // 모든 검증 통과
  return null
}
