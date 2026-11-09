// TODO: 백엔드 OpenAPI 스펙에 nullable이 표시되면 타입을 다시 생성하고 제거한다.
/** OpenAPI 스펙이 nullable을 표시하지 않으므로 zod 스키마를 생성 타입과 대조할 때 null을 허용하도록 넓힌다. */
export type NullableFields<T> = { [K in keyof T]: T[K] | null };
