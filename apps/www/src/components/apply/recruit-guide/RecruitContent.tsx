import { Divider } from "@jects/jds";
import parse, {
  type DOMNode,
  domToReact,
  Element,
  type HTMLReactParserOptions,
  Text,
} from "html-react-parser";

import { cn } from "@/utils/cn";

import { RecruitContentAccordion } from "./RecruitContentAccordion";

const SAFE_HREF = /^(https?:|mailto:)/i;

const PLAIN_TAGS = new Set(["p", "li", "br"]);

const HEADING_CLASS = "font-title font-title-subtle text-wrap text-object-bolder";

/** Accordion 제목은 버튼 안에 렌더링되므로 summary 내부 요소를 제외하고 텍스트만 추출한다. */
function getSummaryText(node: DOMNode): string {
  if (node instanceof Text) {
    return node.data;
  }

  if (node instanceof Element) {
    return (node.children as DOMNode[]).map(getSummaryText).join("");
  }

  return "";
}

const options: HTMLReactParserOptions = {
  replace(node) {
    if (!(node instanceof Element)) {
      return;
    }

    const children = node.children as DOMNode[];

    switch (node.name) {
      case "h2":
        return (
          <h2 className={cn(HEADING_CLASS, "text-title-2")}>{domToReact(children, options)}</h2>
        );
      case "h3":
        return (
          <h3 className={cn(HEADING_CLASS, "text-title-1")}>{domToReact(children, options)}</h3>
        );
      case "ul":
        return <ul className="list-disc ps-[1.5em]">{domToReact(children, options)}</ul>;
      case "hr":
        return <Divider className="my-40" />;
      case "a": {
        const href = node.attribs.href ?? "";

        if (!SAFE_HREF.test(href)) {
          return <>{domToReact(children, options)}</>;
        }

        return (
          <a
            href={href}
            className="underline"
            {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
          >
            {domToReact(children, options)}
          </a>
        );
      }
      case "details": {
        const summary = children.find(
          (child) => child instanceof Element && child.name === "summary"
        );
        const body = children.filter((child) => child !== summary);

        return (
          <RecruitContentAccordion
            className="mt-16"
            title={summary ? getSummaryText(summary).trim() : ""}
          >
            {domToReact(body, options)}
          </RecruitContentAccordion>
        );
      }
      case "script":
      case "style":
        return <></>;
      default:
        if (!PLAIN_TAGS.has(node.name)) {
          return <>{domToReact(children, options)}</>;
        }

        node.attribs = {};
    }
  },
};

interface RecruitContentProps {
  html: string;
  className?: string;
}

/** 허용하는 태그만 렌더링하고, 그 밖의 태그는 내용만 남긴다. */
export function RecruitContent({ html, className }: RecruitContentProps) {
  return (
    <div className={cn("flex flex-col [&>*+h3]:mt-32 [&>h2+*]:mt-40 [&>h3+*]:mt-16", className)}>
      {parse(html, options)}
    </div>
  );
}
