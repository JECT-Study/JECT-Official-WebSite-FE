import { z } from "zod";

import {
  type Question,
  type TempApplication,
  type UploadedPortfolio,
  uploadedPortfolioSchema,
} from "@/apis/apply/schemas";

export const DEFAULT_MAX_FILE_SIZE_MB = 100;

export interface ApplicationFormValues {
  answers: Record<string, string>;
  portfolio: UploadedPortfolio | null;
}

// RHF는 경로의 숫자 세그먼트를 배열 인덱스로 해석하므로 질문 ID 앞에 붙여 객체 키로 사용한다.
const ANSWER_KEY_PREFIX = "q";

export function toAnswerKey(questionId: number) {
  return `${ANSWER_KEY_PREFIX}${questionId}`;
}

function fromAnswerKey(answerKey: string) {
  return answerKey.slice(ANSWER_KEY_PREFIX.length);
}

function isAnswerQuestion(question: Question) {
  return question.inputType === "TEXT" || question.inputType === "URL";
}

function createAnswerSchema(question: Question) {
  if (question.inputType === "URL") {
    const url = z.url({
      protocol: /^https?$/,
      hostname: z.regexes.domain,
      error: "올바른 형식의 URL을 입력해주세요.",
    });

    return question.isRequired ? url : z.union([z.literal(""), url]);
  }

  const text =
    question.maxTextLength === null
      ? z.string()
      : z.string().max(question.maxTextLength, "최대 글자수를 초과했어요.");

  return question.isRequired ? text.trim().min(1, "내용을 입력해주세요.") : text;
}

export function createApplicationSchema(
  questions: Question[]
): z.ZodType<ApplicationFormValues, ApplicationFormValues> {
  const isPortfolioRequired = questions.some(
    (question) => question.inputType === "FILE" && question.isRequired
  );

  return z.object({
    answers: z.object(
      Object.fromEntries(
        questions
          .filter(isAnswerQuestion)
          .map((question) => [toAnswerKey(question.id), createAnswerSchema(question)])
      )
    ),
    portfolio: isPortfolioRequired ? uploadedPortfolioSchema : uploadedPortfolioSchema.nullable(),
  });
}

export function createDefaultValues(
  questions: Question[],
  tempApplication: TempApplication | null
): ApplicationFormValues {
  const [portfolio] = tempApplication?.portfolios ?? [];

  return {
    answers: Object.fromEntries(
      questions
        .filter(isAnswerQuestion)
        .map((question) => [
          toAnswerKey(question.id),
          tempApplication?.answers[String(question.id)] ?? "",
        ])
    ),
    portfolio: portfolio ? uploadedPortfolioSchema.parse(portfolio) : null,
  };
}

export function toApplicationRequest({ answers, portfolio }: ApplicationFormValues) {
  return {
    answers: Object.fromEntries(
      Object.entries(answers).map(([key, value]) => [fromAnswerKey(key), value])
    ),
    portfolios: portfolio ? [{ ...portfolio, sequence: "1" }] : [],
  };
}
