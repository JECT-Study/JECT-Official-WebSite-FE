import { cache } from "react";
import { notFound } from "next/navigation";

import { projectServerApi } from "@/apis/project/api.server";
import type { ProjectDetail, ProjectImage } from "@/apis/project/schemas";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { getRemoteImageSize } from "@/utils/getRemoteImageSize";
import { parseIdParam } from "@/utils/parseIdParam";

const FALLBACK_SIZE = { width: 1600, height: 900 };

export interface SizedProjectImage extends ProjectImage {
  width: number;
  height: number;
}

export interface ProjectDetailWithImageSize extends Omit<
  ProjectDetail,
  "bannerImageUrl" | "descriptionImageUrls"
> {
  bannerImageUrl: SizedProjectImage | null;
  descriptionImageUrls: SizedProjectImage[];
}

async function withSize(image: ProjectImage): Promise<SizedProjectImage> {
  const size = await getRemoteImageSize(image.imageUrl);

  return { ...image, ...(size ?? FALLBACK_SIZE) };
}

async function fetchProject(projectId: number) {
  try {
    return await projectServerApi.getProject(projectId);
  } catch (error) {
    if (hasErrorCode(error, "PROJECT-1")) {
      notFound();
    }

    throw error;
  }
}

export const getProject = cache(
  async (projectIdParam: string): Promise<ProjectDetailWithImageSize> => {
    const projectId = parseIdParam(projectIdParam);

    if (projectId === null) {
      notFound();
    }

    const project = await fetchProject(projectId);
    const [bannerImageUrl, descriptionImageUrls] = await Promise.all([
      project.bannerImageUrl && withSize(project.bannerImageUrl),
      Promise.all(project.descriptionImageUrls.map(withSize)),
    ]);

    return { ...project, bannerImageUrl, descriptionImageUrls };
  }
);
