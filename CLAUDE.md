# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 먼저 읽을 것

공통 컨벤션과 명령어는 `AGENTS.md`를 단일 출처로 따르세요. 아래 `@` 임포트로 그 내용을
이 컨텍스트에 포함합니다.

@AGENTS.md

앱 안에서 작업할 때는 그 앱의 `AGENTS.md`를 추가로 읽습니다.

- `apps/www/AGENTS.md`: 공식 홈페이지 (Next.js, 마이그레이션 진행 중)
- `apps/admin/AGENTS.md`: 백오피스 (Vite SPA)

## 핵심 규칙

- **mise 환경에서 실행**: 셸에 mise가 활성화돼 있지 않으면 모든 명령을
  `mise exec -- pnpm <script>`로 실행합니다. 패키지 매니저는 pnpm만 사용하고
  npm/yarn 명령은 쓰지 않습니다.
- **모노레포**: 루트에서 실행하면 turbo가 전파하고, 한 앱만 돌릴 때는
  `--filter=@ject/www` 같은 필터를 씁니다.
- **완료 전 검증**: 변경을 끝냈다고 보고하기 전에 `pnpm typecheck`와 `pnpm lint`를
  실행해 통과를 확인합니다. UI/빌드에 영향이 있으면 `pnpm build`까지 확인합니다.
  추측으로 "통과한다"고 말하지 말고 실제 출력으로 확인하세요.
- **주석은 적게, 평서형 `~한다`로**: `AGENTS.md`의 "주석" 절을 따릅니다.
- **타입 선언**: 객체 형태는 `interface` + `extends`가 기본입니다.
- **문서/주석은 한국어로** 작성합니다.
