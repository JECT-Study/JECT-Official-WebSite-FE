import type { Metadata } from "next";

import { FaqTabs } from "@/components/faq";
import { PageHeader } from "@/components/layout";
import { FAQ_CATEGORIES } from "@/constants/faq";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "FAQ",
};

export function generateStaticParams() {
  return [
    { slug: [] },
    ...FAQ_CATEGORIES.flatMap((category) => [
      { slug: [category.id] },
      ...category.items.map((item) => ({ slug: [category.id, item.id] })),
    ]),
  ];
}

export default async function FaqPage({ params }: PageProps<"/faq/[[...slug]]">) {
  const { slug = [] } = await params;
  const [categoryId = FAQ_CATEGORIES[0].id, questionId] = slug;

  return (
    <>
      <PageHeader title="FAQ" description="젝트에 대해 자주 묻는 질문들이 정리되어 있어요." />
      <FaqTabs
        key={slug.join("/")}
        categories={FAQ_CATEGORIES}
        initialCategoryId={categoryId}
        initialQuestionId={questionId}
      />
    </>
  );
}
