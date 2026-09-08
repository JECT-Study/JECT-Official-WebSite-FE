# @ject/styles

두 앱이 공유하는 스타일 진입점입니다. `@jects/jds`의 스타일시트와 글꼴을 가져오고, JDS
토큰을 Tailwind 테마에 연결합니다.

## 사용

각 앱의 `src/styles/globals.css`에서 가져옵니다.

```css
@layer theme, base, jds, components, utilities;

@import "tailwindcss";
@import "@ject/styles";
```

레이어 선언은 앱에 두고 `@import "tailwindcss"`보다 앞에 둡니다.

## 갱신

```bash
pnpm gen:theme
```

`theme.css`는 `@jects/jds/tokens`의 `vars`에서 생성합니다. 결과는 커밋하며, CI가 PR마다
다시 생성해 커밋된 파일과 비교합니다. JDS 버전을 올리면 함께 실행합니다.

## 이름 규칙

`semantic` 마디를 뺀 경로를 Tailwind 네임스페이스에 붙입니다.

| JDS                                   | Tailwind             | 예시              |
| ------------------------------------- | -------------------- | ----------------- |
| `color.semantic.surface.deep`         | `--color-*`          | `bg-surface-deep` |
| `scheme.semantic.spacing.16`          | `--spacing-*`        | `p-16`, `gap-16`  |
| `scheme.semantic.margin.md`           | `--spacing-margin-*` | `px-margin-md`    |
| `scheme.semantic.radius.8`            | `--radius-*`         | `rounded-8`       |
| `typo.primitive.fontSize.body.md`     | `--text-*`           | `text-body-md`    |
| `typo.primitive.fontWeight.body.bold` | `--font-weight-*`    | `font-body-bold`  |
| `typo.primitive.typeface.body`        | `--font-*`           | `font-body`       |
| `environment.semantic.shadow.raised`  | `--shadow-*`         | `shadow-raised`   |
| `environment.semantic.motion.fluent`  | `--ease-*`           | `ease-fluent`     |
| `environment.semantic.zIndex.overlay` | `--z-index-*`        | `z-overlay`       |

`text-body-md` 하나로 크기, 행간, 자간이 함께 적용됩니다.

브레이크포인트는 `mobile` 320px, `tablet` 768px, `desktop` 1200px입니다.

`colorPrimitive`, `scheme.strokeWeight`, `scheme.opacity`는 매핑하지 않습니다.

## 생성되지 않는 유틸리티

`color`, `spacing`, `radius`, `text`, `font`, `font-weight`, `breakpoint`, `shadow`, `ease`
네임스페이스는 JDS 값으로 대체됩니다. 따라서 `bg-blue-500`, `rounded-lg`, `p-5` 같은 Tailwind
기본 유틸리티는 사용할 수 없으며, JDS에 없는 값은 임의 값(`p-[5px]`)으로 작성합니다. 색상은
`transparent`, `current`, `inherit`만 사용할 수 있습니다.

## 글꼴

`fonts.css`가 `Pretendard Variable`과 `D2Coding`을 선언하고 파일은 `fonts/`에 둡니다. JDS
리셋이 이 이름들을 `body`에 지정합니다.
