import { PAGE_TITLE } from "@/constants/pageTitle";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <title>{PAGE_TITLE.home}</title>
      <h1 className="font-title text-title-2 font-title-subtle">JECT Admin</h1>
      <p className="font-body text-body-sm font-body-normal text-object-alternative">
        준비 중입니다.
      </p>
    </div>
  );
}
