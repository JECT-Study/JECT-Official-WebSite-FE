import { z } from "zod";

export const emailSchema = z.email("올바른 형식의 이메일을 입력해주세요.");

export const pinSchema = z.string().regex(/^\d{6}$/, "PIN 6자리를 모두 입력해주세요.");
