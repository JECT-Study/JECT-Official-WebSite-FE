import type { Metadata } from "next";

import { TeamProjectDetail } from "@/components/team-project";
import { getProject } from "@/components/team-project/getProject";
import { createPageMetadata } from "@/constants/metadata";

export const revalidate = 3600;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps<"/team-projects/[projectId]">): Promise<Metadata> {
  const { name, description, bannerImageUrl } = await getProject((await params).projectId);

  return createPageMetadata({
    title: name,
    description,
    ...(bannerImageUrl && {
      images: [
        {
          url: bannerImageUrl.imageUrl,
          width: bannerImageUrl.width,
          height: bannerImageUrl.height,
        },
      ],
    }),
  });
}

export default async function TeamProjectDetailPage({
  params,
}: PageProps<"/team-projects/[projectId]">) {
  const project = await getProject((await params).projectId);

  return <TeamProjectDetail project={project} />;
}
