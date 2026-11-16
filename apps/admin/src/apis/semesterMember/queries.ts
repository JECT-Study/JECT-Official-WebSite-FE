import { infiniteQueryOptions } from "@tanstack/react-query";

import { SEMESTER_MEMBER_PAGE_SIZE } from "@/constants/semesterMember";

import { semesterMemberApi, type SemesterMemberListFilter } from "./api";

export const semesterMemberQueries = {
  all: () => ["semesterMember"] as const,
  lists: () => [...semesterMemberQueries.all(), "list"] as const,
  list: (filter: SemesterMemberListFilter) =>
    infiniteQueryOptions({
      queryKey: [...semesterMemberQueries.lists(), filter],
      queryFn: ({ pageParam }) =>
        semesterMemberApi.getSemesterMembers({
          ...filter,
          cursor: pageParam,
          size: SEMESTER_MEMBER_PAGE_SIZE,
        }),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    }),
};
