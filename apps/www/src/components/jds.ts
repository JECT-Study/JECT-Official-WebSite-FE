"use client";

/**
 * JDS는 모듈 평가 단계에서 `createContext`를 호출하므로 서버 컴포넌트에서 직접 가져올 수 없다.
 * 서버 컴포넌트는 이 파일을 거쳐 클라이언트 경계를 통과시킨다. 클라이언트 컴포넌트는 `@jects/jds`에서 바로 가져온다.
 */
export { Divider, Icon } from "@jects/jds";
