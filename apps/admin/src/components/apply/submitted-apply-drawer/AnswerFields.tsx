import { useRef } from "react";

import { File, Link, Textarea, TextField } from "@jects/jds";
import { useFormContext, useWatch } from "react-hook-form";

import type { ApplyDetail } from "@/apis/apply/schemas";
import { TOAST_CONTENT } from "@/constants/toast";
import { showToast } from "@/utils/showToast";

import { MAX_ANSWER_LENGTH, type SubmittedApplyFormValues } from "./schemas";

type QuestionInputType = "TEXT" | "URL" | "FILE";

// TODO: 상세 응답에 질문의 inputType이 추가되면 제목으로 추정하지 않고 그 값을 사용한다.
const getQuestionInputType = (title: string): QuestionInputType => {
  if (title.includes("포트폴리오")) return "FILE";
  if (title.includes("GitHub") || title.includes("블로그")) return "URL";
  return "TEXT";
};

// 스킴 없이 입력한 주소가 상대 경로로 열리지 않도록 https를 붙인다.
const toExternalUrl = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

// 다른 출처의 URL에는 download 속성이 무시되므로 blob으로 받아 원래 파일명으로 저장한다.
const downloadFile = async (fileUrl: string, fileName: string) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`파일 다운로드 실패: ${response.status}`);
    const objectUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(objectUrl);
  } catch {
    showToast(TOAST_CONTENT.downloadFileFailed);
  }
};

interface EmptyAnswerProps {
  children: string;
}

function EmptyAnswer({ children }: EmptyAnswerProps) {
  return <p className="text-body-md font-body-normal text-object-alternative">{children}</p>;
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
      {visiblePortfolios.length === 0 && <EmptyAnswer>제출한 포트폴리오가 없어요</EmptyAnswer>}
      {visiblePortfolios.map(({ portfolioId, fileUrl, fileName, fileSize }) => {
        const fileProps = {
          fileName,
          fileSize: Number(fileSize),
          onClick: () => void downloadFile(fileUrl, fileName),
        };
        return isEditing ? (
          <File
            key={portfolioId}
            {...fileProps}
            removable
            onRemove={() => removePortfolio(portfolioId)}
          />
        ) : (
          <File key={portfolioId} {...fileProps} />
        );
      })}
    </div>
  );
}

interface AnswerFieldProps {
  isEditing: boolean;
  inputType: QuestionInputType;
  index: number;
  answer: string | null;
  portfolios: ApplyDetail["portfolios"];
}

function AnswerField({ isEditing, inputType, index, answer, portfolios }: AnswerFieldProps) {
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
      if (isEditing) {
        return (
          <TextField>
            <TextField.Input {...register(`answers.${index}.answer`)} />
          </TextField>
        );
      }
      return (
        <div className="flex py-6 text-body-md">
          {answer ? (
            <Link
              href={toExternalUrl(answer)}
              target="_blank"
              rel="noopener noreferrer"
              external
              className="break-all"
            >
              {answer}
            </Link>
          ) : (
            <EmptyAnswer>입력한 URL이 없어요</EmptyAnswer>
          )}
        </div>
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
      {answers.map(({ questionId, questionTitle, answer }, index) => (
        <section key={questionId} className="flex flex-col gap-16">
          <h3 className="text-title-1 font-title-subtle text-object-boldest">
            {index + 1}. {questionTitle}
          </h3>
          <AnswerField
            isEditing={isEditing}
            inputType={getQuestionInputType(questionTitle)}
            index={index}
            answer={answer}
            portfolios={portfolios}
          />
        </section>
      ))}
    </div>
  );
}
