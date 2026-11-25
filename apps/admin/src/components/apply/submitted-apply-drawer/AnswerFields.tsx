import { File, Textarea, TextField } from "@jects/jds";
import { useFormContext } from "react-hook-form";

import type { ApplyDetail } from "@/apis/apply/schemas";

import type { SubmittedApplyFormValues } from "./schemas";

type QuestionInputType = "TEXT" | "URL" | "FILE";

// TODO: 상세 응답에 질문의 inputType이 추가되면 제목으로 추정하지 않고 그 값을 사용한다.
const getQuestionInputType = (title: string): QuestionInputType => {
  if (title.includes("포트폴리오")) return "FILE";
  if (title.includes("GitHub") || title.includes("블로그")) return "URL";
  return "TEXT";
};

interface AnswerFieldProps {
  inputType: QuestionInputType;
  index: number;
  portfolios: ApplyDetail["portfolios"];
}

function AnswerField({ inputType, index, portfolios }: AnswerFieldProps) {
  const { register } = useFormContext<SubmittedApplyFormValues>();

  switch (inputType) {
    case "TEXT":
      return (
        <Textarea readonly>
          <Textarea.Control maxLength={500} {...register(`answers.${index}.answer`)} />
          <Textarea.Footer>
            <Textarea.Counter />
          </Textarea.Footer>
        </Textarea>
      );
    case "URL":
      return (
        <TextField readonly>
          <TextField.Input {...register(`answers.${index}.answer`)} />
        </TextField>
      );
    case "FILE":
      return portfolios.map(({ portfolioId, fileName, fileSize }) => (
        <File key={portfolioId} fileName={fileName} fileSize={Number(fileSize)} readonly />
      ));
  }
}

interface AnswerFieldsProps {
  answers: ApplyDetail["answers"];
  portfolios: ApplyDetail["portfolios"];
}

export function AnswerFields({ answers, portfolios }: AnswerFieldsProps) {
  return (
    <div className="flex flex-col gap-32 px-margin-lg pt-24 pb-96 tablet:pt-32">
      {answers.map(({ questionId, questionTitle }, index) => (
        <section key={questionId} className="flex flex-col gap-16">
          <h3 className="text-title-1 font-title-subtle text-object-boldest">
            {index + 1}. {questionTitle}
          </h3>
          <AnswerField
            inputType={getQuestionInputType(questionTitle)}
            index={index}
            portfolios={portfolios}
          />
        </section>
      ))}
    </div>
  );
}
