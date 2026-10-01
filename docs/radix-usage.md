# Radix 직접 사용

앱에서 `radix-ui`를 직접 가져와 구현하는 범위와, 그 구현을 JDS 컴포넌트로 교체하는 절차를
정합니다.

## 사용 범위

JDS에 대응하는 컴포넌트가 없는 프리미티브만 Radix로 직접 사용합니다.

## 절차

1. 먼저 Radix로 직접 구현합니다. 같은 시점에 2팀에 해당 컴포넌트를 요청합니다.
2. JDS에 반영되어 릴리스되면 직접 구현되어 있는 곳을 JDS 컴포넌트로 교체합니다.
3. 그 뒤로 새로 작성하는 코드는 JDS를 사용합니다.

## 작성 규칙

- **컴포넌트로 감싸서 사용합니다.** 페이지에서 `radix-ui`를 직접 가져오지 않고
  `src/components/` 아래 컴포넌트 안에서만 사용합니다. JDS로 교체할 때 수정 범위가 그
  컴포넌트로 한정됩니다.
- **시각 값은 JDS 토큰으로 지정합니다.** 오버레이 색, 그림자, z-index, 모션은
  [packages/styles/README.md](../packages/styles/README.md)의 유틸리티를 사용합니다.
- **Radix의 기본 동작을 유지합니다.** 포커스 트랩과 복원, Escape와 바깥 클릭 닫기, 스크롤
  잠금은 Radix가 처리하므로 다시 구현하지 않습니다.

## radix-ui 사본

JDS는 정식 버전(1.0) 이전으로 이 저장소의 앱과 함께 개발되고 있습니다. 필요한 컴포넌트가
JDS에 반영되고 릴리스될 때까지 작업이 멈추지 않도록 앱에서 Radix를 직접 사용하며, JDS는 이를
위해 `radix-ui`를 `peerDependencies`로 선언합니다. JDS가 안정화되기 전까지 적용하는 임시
조치입니다.

Radix의 `DismissableLayer`와 `FocusScope`는 열린 레이어 목록을 모듈 스코프에서 관리합니다.
JDS와 앱이 서로 다른 사본을 가져오면 두 사본이 각자 목록을 가지므로, JDS 컴포넌트 위에 앱의
Popover를 열었을 때 Escape와 바깥 클릭이 닫을 레이어를 판단하지 못하고 포커스 트랩도 서로
충돌합니다. `dependencies`로 선언하면 버전 범위가 겹칠 때만 한 사본으로 해석되지만, peer로 두면
앱이 설치한 사본 하나를 JDS가 함께 사용합니다.

따라서 JDS를 사용하는 앱은 Radix를 직접 가져오지 않더라도 `package.json`에 `radix-ui`를
선언하고, 버전은 JDS의 `peerDependencies` 범위를 따릅니다. 의존성이나 JDS 버전을 변경할 때
사본이 하나인지 확인합니다.

```bash
pnpm -r why radix-ui    # "Found 1 version of radix-ui"가 출력되어야 합니다
```
