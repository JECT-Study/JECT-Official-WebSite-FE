import { z } from "zod";

export const localDateTimeSchema = z.iso
  // 서버는 시간대 표기가 없는 LocalDateTime을 반환한다.
  .datetime({ local: true })
  // local 옵션은 Z로 끝나는 값도 허용하므로 별도로 처리한다.
  .refine((value) => !value.endsWith("Z"));
