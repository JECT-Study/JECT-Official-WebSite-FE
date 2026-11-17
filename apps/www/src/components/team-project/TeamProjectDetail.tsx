import type { FC, ReactNode, SVGProps } from "react";
import Image from "next/image";

import { BlockButton, ContentBadge } from "@jects/jds";

import type { TeamMemberNames } from "@/apis/project/schemas";
import PositionBe from "@/assets/svg/position-be.svg";
import PositionFe from "@/assets/svg/position-fe.svg";
import PositionPd from "@/assets/svg/position-pd.svg";
import PositionPm from "@/assets/svg/position-pm.svg";
import { CopyUrlButton } from "@/components/common/copy-url-button";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/formatDate";

import type { ProjectDetailWithImageSize, SizedProjectImage } from "./getProject";
import { TeamProjectDetailNavigation } from "./TeamProjectDetailNavigation";

const CONTENT_IMAGE_SIZES = "(min-width: 1200px) 922px, 100vw";

interface Position {
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  headerClassName: string;
  labelClassName: string;
}

const POSITIONS = {
  frontendDevelopers: {
    label: "프론트엔드 개발자",
    icon: PositionFe,
    headerClassName: "bg-theme-green-alpha-subtlest",
    labelClassName: "text-theme-green-normal",
  },
  backendDevelopers: {
    label: "백엔드 개발자",
    icon: PositionBe,
    headerClassName: "bg-theme-sky-alpha-subtlest",
    labelClassName: "text-theme-sky-normal",
  },
  productManagers: {
    label: "프로덕트 매니저",
    icon: PositionPm,
    headerClassName: "bg-theme-orange-alpha-subtlest",
    labelClassName: "text-theme-orange-normal",
  },
  productDesigners: {
    label: "프로덕트 디자이너",
    icon: PositionPd,
    headerClassName: "bg-theme-purple-alpha-subtlest",
    labelClassName: "text-theme-purple-normal",
  },
} satisfies Record<keyof TeamMemberNames, Position>;

const POSITION_KEYS = Object.keys(POSITIONS) as (keyof TeamMemberNames)[];

interface TeammateCardProps {
  position: Position;
  names: string[];
}

function TeammateCard({ position, names }: TeammateCardProps) {
  const { label, icon: PositionIcon, headerClassName, labelClassName } = position;

  return (
    <div className="min-w-[180px] flex-1 overflow-hidden rounded-4 border border-stroke-subtle bg-surface-shallow font-label text-label-md font-label-normal">
      <div
        className={cn(
          "flex items-center gap-8 border-b border-stroke-subtle px-12 py-8",
          headerClassName
        )}
      >
        <PositionIcon aria-hidden className="size-[14px] shrink-0" />
        <span className={labelClassName}>{label}</span>
      </div>
      <ul className="flex flex-wrap gap-x-10 gap-y-4 p-12 text-object-bolder">
        {names.map((name, index) => (
          <li key={`${name}-${index}`}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

interface ProjectImageProps {
  image: SizedProjectImage;
  alt: string;
  preload?: boolean;
}

function ProjectImage({ image, alt, preload }: ProjectImageProps) {
  return (
    <Image
      src={image.imageUrl}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes={CONTENT_IMAGE_SIZES}
      preload={preload}
      className="h-auto w-full border border-stroke-alpha-subtler"
    />
  );
}

interface InfoRowProps {
  label: string;
  children: ReactNode;
}

function InfoRow({ label, children }: InfoRowProps) {
  return (
    <div className="flex border-b border-stroke-subtle last:border-b-0">
      <dt className="shrink-0 border-r border-stroke-subtle bg-fill-subtlest p-12 text-object-normal">
        {label}
      </dt>
      <dd className="flex flex-wrap gap-x-10 gap-y-4 p-12 text-object-bolder">{children}</dd>
    </div>
  );
}

interface TeamProjectDetailProps {
  project: ProjectDetailWithImageSize;
}

export function TeamProjectDetail({ project }: TeamProjectDetailProps) {
  const serviceLink = project.serviceUrl || project.githubUrl;

  return (
    <div className="flex flex-col">
      <TeamProjectDetailNavigation />

      <div className="flex flex-col gap-32 pt-margin-xl pb-margin-3xl">
        {project.bannerImageUrl && (
          <ProjectImage image={project.bannerImageUrl} alt={`${project.name} 배너`} preload />
        )}

        {project.sampleImageUrls.length > 0 && (
          <div className="flex gap-16">
            {project.sampleImageUrls.map((image) => (
              <div
                key={image.sequence}
                className="relative aspect-video flex-1 overflow-hidden border border-stroke-alpha-subtler"
              >
                <Image
                  src={image.imageUrl}
                  alt={`${project.name} 샘플 이미지 ${image.sequence}`}
                  fill
                  sizes="(min-width: 1200px) 300px, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-24">
          <div className="flex flex-col gap-12">
            {project.badges.length > 0 && (
              <div className="flex flex-wrap gap-6">
                {project.badges.map((badge) => (
                  <ContentBadge key={badge} size="lg" badgeStyle="outlined" hierarchy="secondary">
                    {badge}
                  </ContentBadge>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-8">
              <h1 className="font-title text-title-5 font-title-bold text-object-boldest">
                {project.name}
              </h1>
              <CopyUrlButton />
            </div>
            <p className="font-body text-body-sm font-body-normal text-pretty text-object-bold">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col gap-12 font-label text-label-md font-label-normal">
            <dl className="overflow-hidden rounded-4 border border-stroke-subtle bg-surface-shallow">
              <InfoRow label="진행 기간">
                <span>{formatDate(project.startDate)}</span>
                <span>-</span>
                <span>{formatDate(project.endDate)}</span>
              </InfoRow>
              <InfoRow label="사용 기술">
                {project.techStack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </InfoRow>
            </dl>

            <div className="flex flex-wrap gap-12">
              {POSITION_KEYS.map((key) => (
                <TeammateCard
                  key={key}
                  position={POSITIONS[key]}
                  names={project.teamMemberNames[key]}
                />
              ))}
            </div>
          </div>
        </div>

        {serviceLink ? (
          <BlockButton asChild hierarchy="accent" size="lg" suffixIcon="external-link">
            <a href={serviceLink} target="_blank" rel="noopener noreferrer">
              {project.serviceUrl ? "서비스 바로가기" : "GitHub 바로가기"}
            </a>
          </BlockButton>
        ) : (
          <BlockButton hierarchy="accent" size="lg" disabled>
            해당 서비스는 종료되었습니다.
          </BlockButton>
        )}
      </div>

      {project.descriptionImageUrls.length > 0 && (
        <div className="flex flex-col gap-24">
          {project.descriptionImageUrls.map((image) => (
            <ProjectImage
              key={image.sequence}
              image={image}
              alt={`${project.name} 소개 이미지 ${image.sequence}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
