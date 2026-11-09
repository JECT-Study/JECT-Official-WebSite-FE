import { hasErrorCode } from "./hasErrorCode";

export function isRecruitClosedError(error: unknown) {
  // 모집 기간은 Redis 플래그로 먼저 검사해 GLOBAL-9를 반환한다.
  // Redis 장애로 검사를 건너뛴 경우에는 프로필 저장 시 DB 조회에서 RECRUIT-1을 반환하기도 한다.
  return hasErrorCode(error, "GLOBAL-9") || hasErrorCode(error, "RECRUIT-1");
}
