#!/usr/bin/env bash
# PreToolUse 훅: 에이전트가 여는 PR을 초안으로만 허용한다.
# `gh pr create`에 --draft가 없으면 exit 2로 막고 사유를 에이전트에게 전달한다.
set -uo pipefail

command=$(jq -r '.tool_input.command // empty' 2>/dev/null)

[ -n "$command" ] || exit 0

# gh pr create가 아니면 통과한다. 파이프나 && 뒤에 오는 형태도 검사한다.
printf '%s' "$command" | grep -qE '(^|[;&|(][[:space:]]*|[[:space:]])gh[[:space:]]+pr[[:space:]]+create([[:space:]]|$)' || exit 0

printf '%s' "$command" | grep -qE '[[:space:]]--draft([[:space:]]|=|$)' && exit 0

cat >&2 <<'MSG'
이 저장소는 에이전트가 여는 PR을 초안으로만 허용합니다. 사람의 검증을 거친 뒤
`gh pr ready <번호>`로 사용자가 직접 전환합니다.

`gh pr create`에 --draft를 붙여 다시 실행하세요.
MSG
exit 2
