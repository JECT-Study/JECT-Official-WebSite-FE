"use client";

import { useState } from "react";

import { Card, Icon, SelectField, type SelectOption } from "@jects/jds";
import { useInfiniteQuery } from "@tanstack/react-query";

import { projectApi } from "@/apis/project/api";
import { projectQueryKeys } from "@/apis/project/queryKeys";
import type { ProjectPage, ProjectSummary } from "@/apis/project/schemas";
import { routeTo } from "@/constants/routes";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const ALL_CATEGORY = "ALL";
const SEMESTER_PREFIX = "SEMESTER_";

function getSemester(categoryName: string) {
  return Number(categoryName.replace(SEMESTER_PREFIX, ""));
}

function toCategoryOptions({ categorySummaries }: ProjectSummary): SelectOption[] {
  return [...categorySummaries]
    .sort((a, b) => {
      if (a.categoryName === ALL_CATEGORY) return -1;
      if (b.categoryName === ALL_CATEGORY) return 1;

      return getSemester(b.categoryName) - getSemester(a.categoryName);
    })
    .map(({ categoryName, count }) => ({
      value: categoryName,
      label:
        categoryName === ALL_CATEGORY
          ? `전체(${count})`
          : `${getSemester(categoryName)}기(${count})`,
    }));
}

function LoadingSpinner() {
  return (
    <div className="flex h-[160px] items-center justify-center text-object-alternative">
      <Icon name="loader-circle" size="xl" className="animate-spin" aria-hidden />
    </div>
  );
}

interface TeamProjectListProps {
  summary: ProjectSummary;
  initialPage: ProjectPage;
}

export function TeamProjectList({ summary, initialPage }: TeamProjectListProps) {
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const category = selectedCategory === ALL_CATEGORY ? null : selectedCategory;

  const { data, isPending, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage } =
    useInfiniteQuery({
      queryKey: projectQueryKeys.list(category),
      queryFn: ({ pageParam }) => projectApi.getProjects(category, pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
      initialData: category === null ? { pages: [initialPage], pageParams: [0] } : undefined,
      throwOnError: (_, query) => query.state.data === undefined,
    });
  const targetRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  });

  const projects = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <div className="flex flex-col gap-40">
      <SelectField className="w-[160px]">
        <SelectField.Input
          aria-label="기수 선택"
          options={toCategoryOptions(summary)}
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value ?? ALL_CATEGORY)}
        />
      </SelectField>

      {isPending ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-x-20 gap-y-24 tablet:grid-cols-2 desktop:grid-cols-3">
            {/* TODO: JDS 카드가 라우팅 컴포넌트를 지원하면 next/link로 교체한다. */}
            {projects.map((project) => (
              <Card.Preset.Plate.Link
                key={project.id}
                layout="vertical"
                href={routeTo.projectDetail(String(project.id))}
                image={
                  project.thumbnailUrl
                    ? { src: project.thumbnailUrl, alt: project.summary }
                    : undefined
                }
                title={project.name}
                body={project.description}
                caption={project.serviceType}
              />
            ))}
          </div>
          <div ref={targetRef}>{isFetchingNextPage && <LoadingSpinner />}</div>
        </div>
      )}
    </div>
  );
}
