import { BlockButton, IconButton, TextField } from "@jects/jds";

export function LoginForm() {
  return (
    <form className="flex flex-col gap-28">
      <div className="flex flex-col gap-20">
        <TextField>
          <TextField.Label>이메일</TextField.Label>
          <TextField.Input type="email" placeholder="name@ject.com" />
        </TextField>

        <div className="flex gap-10">
          <TextField className="flex-1">
            <TextField.Label>비밀번호</TextField.Label>
            <TextField.Input type="password" placeholder="비밀번호를 입력해주세요" />
          </TextField>
          <div className="flex h-[42px] items-center self-end">
            <IconButton type="button" icon="eye-off" size="lg" hierarchy="tertiary" />
          </div>
        </div>
      </div>

      <BlockButton type="submit" size="lg">
        로그인
      </BlockButton>
    </form>
  );
}
