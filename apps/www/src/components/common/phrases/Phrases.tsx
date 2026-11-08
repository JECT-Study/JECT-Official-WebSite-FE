import { Fragment, type ReactNode } from "react";

/** 구 안에서는 줄을 바꾸지 않고, 구 사이에서만 줄을 바꾼다. */
export function Phrases({ phrases }: { phrases: ReactNode[] }) {
  return phrases.map((phrase, index) => (
    <Fragment key={index}>
      {index > 0 && " "}
      <span className="inline-block">{phrase}</span>
    </Fragment>
  ));
}
