"use client";

import { Fragment } from "react";

import { Card, Divider, EmptyState } from "@jects/jds";

import type { MiniStudy } from "@/apis/mini-study/schemas";

interface MiniStudyListProps {
  miniStudies: MiniStudy[];
}

export function MiniStudyList({ miniStudies }: MiniStudyListProps) {
  if (miniStudies.length === 0) {
    return <EmptyState body="등록된 미니 스터디가 없습니다." />;
  }

  return (
    <div className="flex flex-col gap-24">
      {miniStudies.map((study, index) => (
        <Fragment key={study.id}>
          {index > 0 && <Divider />}
          <Card.Preset.Post.Link
            layout="horizontal"
            href={study.linkUrl ?? ""}
            target="_blank"
            rel="noopener noreferrer"
            isDisabled={!study.linkUrl}
            image={study.imageUrl ? { src: study.imageUrl, alt: study.name } : undefined}
            title={study.name}
            body={study.summary}
            author={study.tag}
            date=""
          />
        </Fragment>
      ))}
    </div>
  );
}
