import logo from "@/assets/svg/logo.svg";
import { LoginForm } from "@/components/auth/login-form/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-surface-deep px-margin-lg py-56">
      <div className="flex w-full max-w-[426px] flex-col gap-28 rounded-12 border border-stroke-alpha-subtle bg-surface-standard p-margin-xl shadow-embossed">
        <div className="flex items-center gap-12">
          <img src={logo} alt="젝트" className="h-[14px] w-auto" />
          <h1 className="text-label-lg font-label-bold text-object-bold">관리자 로그인</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
