import {
  DropdownMenu,
  File,
  Icon,
  IconButton,
  LabelButton,
  MultiSelectField,
  SelectField,
  type SelectOption,
  Textarea,
  TextField,
} from "@jects/jds";

import { Drawer } from "@/components/common/drawer/Drawer";
import { CAREER_DETAILS_LABELS, SELECTION_RESULT_LABELS } from "@/constants/apply";

const toOptions = (labels: Record<string, string>): SelectOption[] =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const CAREER_DETAILS_OPTIONS = toOptions(CAREER_DETAILS_LABELS);
const SELECTION_RESULT_OPTIONS = toOptions(SELECTION_RESULT_LABELS);

// TODO: 지원서 상세 API를 연결하면 질문 목록과 답변으로 교체한다.
const QUESTION_TITLES = [
  "1. 간단하게 자신을 소개해주세요",
  "2. 지원 분야와 관련해 가장 몰입했던 경험 중 하나를 말씀해주세요",
  "3. 성장을 위한 경험 중 실패나 어려움을 해결하기 위해 어떤 노력을 기울이셨나요?",
  "4. 젝트에 참여하시려는 이유와 달성하고 싶은 목표는 무엇인가요?",
];

interface SubmittedApplyDrawerProps {
  applyId: number | null;
  onClose: () => void;
}

export default function SubmittedApplyDrawer({ applyId, onClose }: SubmittedApplyDrawerProps) {
  return (
    <Drawer
      open={applyId !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="지원서 정보"
      headerAction={
        <div className="flex items-center gap-16 max-tablet:hidden">
          <LabelButton hierarchy="tertiary" size="md">
            편집
          </LabelButton>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <IconButton hierarchy="tertiary" size="lg" icon="ellipsis" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" sideOffset={12} className="w-[160px]">
              <DropdownMenu.Group>
                <DropdownMenu.Button prefixIcon="clock-3" prefixIconVisible>
                  변경 이력
                </DropdownMenu.Button>
                {/* JDS 메뉴 항목에 색 옵션이 없어 아이콘과 라벨에 직접 지정한다. */}
                <DropdownMenu.Button
                  prefixIcon="trash"
                  prefixIconVisible
                  className="*:text-feedback-destructive-neutral"
                >
                  삭제
                </DropdownMenu.Button>
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      }
    >
      <form>
        <div className="flex flex-col gap-16 border-b border-stroke-alpha-subtler px-margin-lg pt-8 pb-20">
          <div className="grid grid-cols-1 gap-12 tablet:grid-cols-2">
            <TextField readonly required>
              <TextField.Label>포지션</TextField.Label>
              <TextField.Input />
            </TextField>
            <TextField readonly required>
              <TextField.Label>모집 단위</TextField.Label>
              <TextField.Input />
            </TextField>
            <TextField readonly required>
              <TextField.Label>이름</TextField.Label>
              <TextField.Input />
            </TextField>
            <TextField readonly required>
              <TextField.Label>휴대폰 번호</TextField.Label>
              <TextField.Input />
            </TextField>
            <SelectField readonly required>
              <SelectField.Label>지원자 신분</SelectField.Label>
              <SelectField.Input options={CAREER_DETAILS_OPTIONS} />
            </SelectField>
            <TextField readonly>
              <TextField.Label>이메일</TextField.Label>
              <TextField.Input />
            </TextField>
            {/* TODO: 상세 API의 값 형식이 정해지면 거주 지역, 경험 기간, 관심 도메인 옵션을 연결한다. */}
            <SelectField readonly>
              <SelectField.Label>거주 지역</SelectField.Label>
              <SelectField.Input options={[]} />
            </SelectField>
            <SelectField readonly>
              <SelectField.Label>직무 관련 경험 기간</SelectField.Label>
              <SelectField.Input options={[]} />
            </SelectField>
            <MultiSelectField readonly>
              <MultiSelectField.Label suffix={<Icon name="info" size="2xs" />}>
                관심 도메인
              </MultiSelectField.Label>
              <MultiSelectField.Input options={[]} />
            </MultiSelectField>
            <SelectField readonly>
              <SelectField.Label>합격 여부</SelectField.Label>
              <SelectField.Input
                options={SELECTION_RESULT_OPTIONS}
                placeholder="옵션을 선택해주세요"
              />
            </SelectField>
            <TextField readonly>
              <TextField.Label suffix={<Icon name="info" size="2xs" />}>예비 번호</TextField.Label>
              <TextField.Input placeholder="예비 합격 상태일 때 확인할 수 있어요" />
            </TextField>
          </div>
          <Textarea readonly>
            <Textarea.Label>비고</Textarea.Label>
            <Textarea.Control maxLength={100} />
            <Textarea.Footer>
              <Textarea.Counter />
            </Textarea.Footer>
          </Textarea>
        </div>
        <div className="flex flex-col gap-32 px-margin-lg py-24 tablet:py-32">
          {QUESTION_TITLES.map((title) => (
            <section key={title} className="flex flex-col gap-16">
              <h3 className="text-title-1 font-title-subtle text-object-boldest">{title}</h3>
              <Textarea readonly>
                <Textarea.Control maxLength={500} />
                <Textarea.Footer>
                  <Textarea.Counter />
                </Textarea.Footer>
              </Textarea>
            </section>
          ))}
          {/* TODO: JDS에 태그 필드가 추가되면 교체한다. */}
          <section className="flex flex-col gap-16">
            <h3 className="text-title-1 font-title-subtle text-object-boldest">
              5. GitHub 주소나 기술 블로그가 있다면 알려주세요
            </h3>
            <TextField readonly>
              <TextField.Input />
            </TextField>
          </section>
          <section className="flex flex-col gap-16">
            <h3 className="text-title-1 font-title-subtle text-object-boldest">
              6. 포트폴리오가 있으시다면 첨부해주세요
            </h3>
            <File fileName="File_name.pdf" fileSize={2_600_000} readonly />
          </section>
        </div>
      </form>
    </Drawer>
  );
}
