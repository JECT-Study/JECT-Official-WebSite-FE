"use client";

import { useId } from "react";

import { FileField, Textarea, TextField, toastController } from "@jects/jds";
import { Controller, useFormContext } from "react-hook-form";

import type { Question } from "@/apis/apply/schemas";
import { useUploadPortfolioMutation } from "@/hooks/apply/useUploadPortfolioMutation";

import { type ApplicationFormValues, DEFAULT_MAX_FILE_SIZE_MB, toAnswerKey } from "./schemas";

const BYTES_PER_MB = 1024 * 1024;

interface ApplicationFieldProps {
  question: Question;
}

interface FieldContentProps extends ApplicationFieldProps {
  titleId: string;
}

function FieldHeader({ titleId, question }: FieldContentProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2
        id={titleId}
        className="font-title text-title-1 font-title-subtle text-wrap text-object-boldest"
      >
        {question.title}
        {question.isRequired && (
          <span aria-hidden className="text-feedback-notifying-static-inverse-bold">
            *
          </span>
        )}
      </h2>
      {question.subtitle && (
        <p className="font-body text-body-sm text-object-alternative">{question.subtitle}</p>
      )}
    </div>
  );
}

function AnswerField({ question, titleId }: FieldContentProps) {
  const { control } = useFormContext<ApplicationFormValues>();

  return (
    <Controller
      name={`answers.${toAnswerKey(question.id)}`}
      control={control}
      render={({ field, fieldState }) => {
        const error = field.value ? fieldState.error : undefined;

        return (
          <Textarea status={error ? "error" : "default"}>
            <Textarea.Control
              className="min-h-112"
              ref={field.ref}
              name={field.name}
              aria-labelledby={titleId}
              required={question.isRequired}
              maxLength={question.maxTextLength ?? undefined}
              placeholder={question.inputHint ?? undefined}
              value={field.value}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.target.value)}
            />
            <Textarea.Footer>
              {error && <Textarea.Helper>{error.message}</Textarea.Helper>}
              <Textarea.Counter />
            </Textarea.Footer>
          </Textarea>
        );
      }}
    />
  );
}

function PortfolioUrlField({ question, titleId }: FieldContentProps) {
  const { control } = useFormContext<ApplicationFormValues>();

  return (
    <Controller
      name={`answers.${toAnswerKey(question.id)}`}
      control={control}
      render={({ field, fieldState }) => {
        const error = field.value ? fieldState.error : undefined;

        return (
          <TextField status={error ? "error" : "default"}>
            {question.label && <TextField.Label>{question.label}</TextField.Label>}
            <TextField.Input
              ref={field.ref}
              name={field.name}
              aria-labelledby={titleId}
              type="url"
              required={question.isRequired}
              placeholder={question.inputHint ?? undefined}
              value={field.value}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.target.value)}
            />
            {error && (
              <TextField.Footer>
                <TextField.Helper>{error.message}</TextField.Helper>
              </TextField.Footer>
            )}
          </TextField>
        );
      }}
    />
  );
}

function PortfolioFileField({ question, titleId }: FieldContentProps) {
  const { control } = useFormContext<ApplicationFormValues>();
  const uploadMutation = useUploadPortfolioMutation();

  const maxFileSizeMb = question.maxFileSize ?? DEFAULT_MAX_FILE_SIZE_MB;

  return (
    <Controller
      name="portfolio"
      control={control}
      render={({ field }) => (
        <FileField disabled={uploadMutation.isPending}>
          {question.label && <FileField.Label>{question.label}</FileField.Label>}
          <FileField.Input
            ref={field.ref}
            name={field.name}
            aria-labelledby={titleId}
            required={question.isRequired}
            accept=".pdf,application/pdf"
            maxSize={maxFileSizeMb * BYTES_PER_MB}
            placeholder="파일을 선택해주세요"
            value={
              field.value
                ? { name: field.value.fileName, size: Number(field.value.fileSize) }
                : null
            }
            onChange={(file) => {
              if (file === null) {
                field.onChange(null);
                return;
              }

              uploadMutation.mutate(file, {
                onSuccess: field.onChange,
                onError: () => {
                  toastController.destructive("파일 업로드 실패", {
                    description: "일시적 오류일 수 있으니 다시 시도해주세요.",
                  });
                },
              });
            }}
            onError={({ type }) => {
              if (type === "FILE_TOO_LARGE") {
                toastController.destructive("파일 최대 용량 초과", {
                  description: `${maxFileSizeMb}MB 이하의 파일만 첨부할 수 있어요.`,
                });
                return;
              }

              toastController.destructive("파일 형식 오류", {
                description: "PDF 파일만 첨부할 수 있어요.",
              });
            }}
          />
          <FileField.Footer>
            <FileField.Helper>
              {maxFileSizeMb}MB 이하의 PDF 파일을 업로드할 수 있어요.
            </FileField.Helper>
            <FileField.Size />
          </FileField.Footer>
        </FileField>
      )}
    />
  );
}

function FieldContent({ question, titleId }: FieldContentProps) {
  switch (question.inputType) {
    case "TEXT":
      return <AnswerField titleId={titleId} question={question} />;
    case "URL":
      return <PortfolioUrlField titleId={titleId} question={question} />;
    case "FILE":
      return <PortfolioFileField titleId={titleId} question={question} />;
    default:
      return null;
  }
}

function ApplicationField({ question }: ApplicationFieldProps) {
  const titleId = useId();

  return (
    <div className="flex flex-col gap-16">
      <FieldHeader titleId={titleId} question={question} />
      <FieldContent titleId={titleId} question={question} />
    </div>
  );
}

interface ApplicationFieldsProps {
  questions: Question[];
}

export function ApplicationFields({ questions }: ApplicationFieldsProps) {
  return (
    questions
      // 현재 선택형 질문을 사용하지 않으므로 렌더링하지 않는다.
      .filter((question) => question.inputType !== "SELECT")
      .map((question) => <ApplicationField key={question.id} question={question} />)
  );
}
