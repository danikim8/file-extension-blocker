import { z } from 'zod';

/**
 * 확장자 문자열 정규화
 * - 공백 제거
 * - 앞의 점(.) 제거
 * - 소문자 변환
 */
export function normalizeExtension(input: string): string {
  return input.trim().replace(/^\.+/, '').toLowerCase();
}

/**
 * 확장자 유효성 검증 스키마
 * - 길이: 1-20자
 * - 형식: 영문 대소문자, 숫자, 언더스코어 (API 레벨에서는 대소문자 허용, 이후 정규화)
 */
export const extensionInputSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: '확장자를 입력해주세요' })
    .max(20, { message: '확장자는 최대 20자까지 입력 가능합니다' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: '영문, 숫자, 언더스코어(_)만 입력 가능합니다' })
});

export type ExtensionInput = z.infer<typeof extensionInputSchema>;
// Backward compatibility for existing tests if needed, or I can update tests immediately.
// I will not export validationExtension anymore as we are parsing, 
// strictly following the Refactoring Plan.
