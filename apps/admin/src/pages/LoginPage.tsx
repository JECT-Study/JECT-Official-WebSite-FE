import { BlockButton, IconButton, TextField } from "@jects/jds";

import logo from "@/assets/svg/logo.svg";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-surface-deep px-margin-lg py-56">
      <form className="flex w-full max-w-[426px] flex-col gap-28 rounded-12 border border-stroke-alpha-subtle bg-surface-standard p-margin-xl shadow-embossed">
        <div className="flex items-center gap-12">
          <img src={logo} alt="젝트" className="h-[14px] w-auto" />
          <h1 className="text-label-lg font-label-bold text-object-bold">관리자 로그인</h1>
        </div>

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
    </main>
  );
}
