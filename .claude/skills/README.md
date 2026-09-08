# 프로젝트 스킬 (Claude Code)

이 디렉토리는 이 저장소 전용 Claude Code 스킬을 모아둡니다. 각 스킬은
`<skill-name>/SKILL.md` 한 파일로 구성되며, 프런트매터의 `description`이 트리거 조건을,
본문이 작업 절차를 정의합니다. 새 세션에서 자동으로 로드되고, 세션 중에는
`/<skill-name>`으로 직접 호출할 수도 있습니다.

공통 전제는 아래와 같습니다.

- 커밋 메시지: `<type>: <한국어 한 줄 요약>` (Conventional Commits prefix는 영어 유지)
- 브랜치: `<type>/<이슈번호>-<이름>` 또는 `<type>/<이름>` (영어 kebab-case)
- PR 본문: `.github/pull_request_template.md`를 단일 출처로 채운 한국어 본문
- 검증: `pnpm typecheck` / `pnpm lint` (필요시 `pnpm build`, `pnpm e2e`), lefthook 훅 존중
- `dev`, `main` 직접 작업 금지
- 에이전트가 여는 PR은 항상 초안(`--draft`). PreToolUse 훅이 강제하며, 리뷰 준비 전환은
  사용자가 `gh pr ready <번호>`로 직접 합니다.

## 스킬 목록

| 스킬                                | 언제 쓰나                                              | 무엇을 하나                                                                      |
| ----------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| [`branch`](./branch/SKILL.md)       | "브랜치 만들어줘", 작업 설명(+선택적 이슈번호)을 줄 때 | 작업 내용으로 type을 추론하고 추천 이름을 만들어 최신 `dev` 기준으로 브랜치 생성 |
| [`commit`](./commit/SKILL.md)       | "커밋해줘", "이거 커밋"                                | 변경을 의미 단위로 나눠 `<type>: 한국어 한 줄` 형식으로 짧게 커밋                |
| [`pr-create`](./pr-create/SKILL.md) | "PR 올려줘", "초안 PR", "WIP PR"                       | 브랜치 push 후 PR 템플릿을 채워 `gh`로 초안 PR 생성                              |

## 일반적인 흐름

```
branch       # 작업 브랜치 생성        예: feat/123-faq-migration
  ↓
(작업)
  ↓
commit       # 변경을 단위별로 커밋
  ↓
pr-create    # 초안 PR 생성
  ↓
(사람 검증)
  ↓
gh pr ready  # 사용자가 직접 리뷰 준비 상태로 전환
```

## 새 스킬을 추가하려면

1. `<skill-name>/SKILL.md`를 만들고 프런트매터에 `name`, `description`을 채운다.
   `description`은 트리거 정확도를 좌우하므로, 무엇을 하는지와 언제 쓰는지(사용자 표현
   예시 포함)를 구체적으로 적는다.
2. 본문은 절차 위주로, 왜 그렇게 하는지 맥락과 함께 작성한다.
3. 이 README의 "스킬 목록" 표에 한 줄 추가한다.
4. 저장소 컨벤션은 루트 [`AGENTS.md`](../../AGENTS.md)가 단일 출처다. 스킬은 그 컨벤션을
   따르되 중복 서술은 피하고 필요한 부분만 참조한다.
