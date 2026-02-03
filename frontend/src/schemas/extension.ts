import { z } from 'zod';

// ✅ 기본 스키마 (중복 체크 없음)
export const extensionInputSchema = z.object({
  name: z.string()
    .trim()
    .transform((val) => val.toLowerCase())
    .pipe(
      z.string()
        .min(1, { message: '확장자를 입력해주세요' })
        .max(20, { message: '확장자는 최대 20자까지 입력 가능합니다' })
        .regex(/^[a-z0-9_]+$/, { 
          message: '영문 소문자, 숫자, 언더스코어(_)만 입력 가능합니다' 
        })
    )
});

// ✅ 중복 체크 포함 스키마 (동적 생성)
export const createExtensionSchema = (existingNames: string[]) =>
  extensionInputSchema.refine(
    (data) => !existingNames.includes(data.name),
    { message: '이미 존재하는 확장자입니다', path: ['name'] }
  );

export type ExtensionInput = z.infer<typeof extensionInputSchema>;
