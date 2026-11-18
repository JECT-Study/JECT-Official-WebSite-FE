import twMergeConfig from "@ject/styles/tw-merge.json" with { type: "json" };
import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge가 JDS 토큰 클래스를 올바르게 병합하도록 토큰 이름을 알려준다. 설정은 `pnpm gen:theme`으로 생성한다.
const twMerge = extendTailwindMerge(twMergeConfig);

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
