import "server-only";

import { imageSize } from "image-size";

const REQUEST_TIMEOUT_MS = 30_000;

const MAX_READ_BYTES = 1024 * 1024;

function concat(a: Uint8Array, b: Uint8Array) {
  const merged = new Uint8Array(a.length + b.length);

  merged.set(a);
  merged.set(b, a.length);

  return merged;
}

function readSize(buffer: Uint8Array) {
  try {
    const { width, height } = imageSize(buffer);

    return { width, height };
  } catch {
    return null;
  }
}

/** 원격 이미지를 크기 정보가 확인될 때까지만 로드한다. 크기를 읽지 못하면 null을 반환한다. */
export async function getRemoteImageSize(url: string) {
  // Next.js는 개발 모드 캐시 등을 위해 응답을 복제해 보관하므로 응답 스트림을 취소해도 다운로드가 계속된다.
  // 읽기를 마치면 원본 요청을 중단해 복제본의 다운로드도 함께 멈춘다.
  const controller = new AbortController();

  try {
    const response = await fetch(url, {
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]),
    });

    if (!response.ok || !response.body) {
      return null;
    }

    const reader = response.body.getReader();
    let buffer = new Uint8Array();

    while (buffer.length < MAX_READ_BYTES) {
      const { done, value } = await reader.read();

      if (done) {
        return null;
      }

      buffer = concat(buffer, value);
      const size = readSize(buffer);

      if (size) {
        return size;
      }
    }

    return null;
  } catch {
    return null;
  } finally {
    controller.abort();
  }
}
