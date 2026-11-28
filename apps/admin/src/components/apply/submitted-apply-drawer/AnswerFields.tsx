import { useRef } from "react";

import { File, Textarea, TextField } from "@jects/jds";
import { useFormContext, useWatch } from "react-hook-form";

import type { ApplyDetail } from "@/apis/apply/schemas";

import { MAX_ANSWER_LENGTH, type SubmittedApplyFormValues } from "./schemas";

type QuestionInputType = "TEXT" | "URL" | "FILE";

// TODO: 상세 응답에 질문의 inputType이 추가되면 제목으로 추정하지 않고 그 값을 사용한다.
const getQuestionInputType = (title: string): QuestionInputType => {
  if (title.includes("포트폴리오")) return "FILE";
  if (title.includes("GitHub") || title.includes("블로그")) return "URL";
  return "TEXT";
};

interface AnswerFieldProps {
  isEditing: boolean;
  inputType: QuestionInputType;
  index: number;
  portfolios: ApplyDetail["portfolios"];
}

interface PortfolioFilesProps {
  isEditing: boolean;
  portfolios: ApplyDetail["portfolios"];
}

function PortfolioFiles({ isEditing, portfolios }: PortfolioFilesProps) {
  const { setValue } = useFormContext<SubmittedApplyFormValues>();
  const deletePortfolioIds = useWatch<SubmittedApplyFormValues, "deletePortfolioIds">({
    name: "deletePortfolioIds",
    defaultValue: [],
  });
  const listRef = useRef<HTMLDivElement>(null);
  const visiblePortfolios = portfolios.filter(
    ({ portfolioId }) => !deletePortfolioIds.includes(portfolioId)
  );

  const removePortfolio = (portfolioId: number) => {
    setValue("deletePortfolioIds", [...deletePortfolioIds, portfolioId], { shouldDirty: true });
    listRef.current?.focus();
  };

  return (
    <div ref={listRef} tabIndex={-1} className="flex flex-col outline-none">
      {visiblePortfolios.map(({ portfolioId, fileName, fileSize }) => {
        const fileProps = {
          fileName,
          fileSize: Number(fileSize),
        };
        return isEditing ? (
          <File
            key={portfolioId}
            {...fileProps}
            removable
            onRemove={() => removePortfolio(portfolioId)}
          />
        ) : (
          <File key={portfolioId} {...fileProps} readonly />
        );
      })}
    </div>
  );
}

function AnswerField({ isEditing, inputType, index, portfolios }: AnswerFieldProps) {
  const { register } = useFormContext<SubmittedApplyFormValues>();

  switch (inputType) {
    case "TEXT":
      return (
        <Textarea readonly={!isEditing}>
          <Textarea.Control
            maxLength={MAX_ANSWER_LENGTH}
            {...register(`answers.${index}.answer`)}
          />
          <Textarea.Footer>
            <Textarea.Counter />
          </Textarea.Footer>
        </Textarea>
      );
    case "URL":
      return (
        <TextField readonly={!isEditing}>
          <TextField.Input {...register(`answers.${index}.answer`)} />
        </TextField>
      );
    case "FILE":
      return <PortfolioFiles isEditing={isEditing} portfolios={portfolios} />;
  }
}

interface AnswerFieldsProps {
  isEditing: boolean;
  answers: ApplyDetail["answers"];
  portfolios: ApplyDetail["portfolios"];
}

export function AnswerFields({ isEditing, answers, portfolios }: AnswerFieldsProps) {
  return (
    <div className="flex flex-col gap-32 px-margin-lg pt-24 pb-96 tablet:pt-32">
      {answers.map(({ questionId, questionTitle }, index) => (
        <section key={questionId} className="flex flex-col gap-16">
          <h3 className="text-title-1 font-title-subtle text-object-boldest">
            {index + 1}. {questionTitle}
          </h3>
          <AnswerField
            isEditing={isEditing}
            inputType={getQuestionInputType(questionTitle)}
            index={index}
            portfolios={portfolios}
          />
        </section>
      ))}
    </div>
  );
}
