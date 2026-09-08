#!/usr/bin/env bash
# Stop 훅: 턴이 끝날 때 변경된 코드가 있으면 format:check / lint / typecheck를 자동 실행한다.
# 하나라도 실패하면 decision:block으로 에이전트에게 오류를 전달해 수정을 유도한다.
set -uo pipefail

input=$(cat)

# 무한 루프 방지: 이미 Stop 훅으로 이어서 실행 중이면 다시 막지 않는다.
if [ "$(printf '%s' "$input" | jq -r '.stop_hook_active // false')" = "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0

# 검사할 변경이 없으면 통과한다. 일반 대화 턴에서 불필요하게 실행되지 않게 한다.
if ! git status --porcelain 2>/dev/null | grep -qE '\.(ts|tsx|js|jsx|mjs|json|css|html|md|ya?ml)$'; then
  exit 0
fi

out=""
fail=0
for step in format:check lint typecheck; do
  if ! step_out=$(mise exec -- pnpm run -s "$step" 2>&1); then
    fail=1
    out+=$'\n=== '"$step"$' 실패 ===\n'"$step_out"$'\n'
  fi
done

if [ "$fail" -ne 0 ]; then
  jq -n --arg r "자동 검사(format/lint/typecheck) 실패. 아래 오류를 고친 뒤 마무리하세요:$out" \
    '{decision:"block", reason:$r}'
fi
exit 0
