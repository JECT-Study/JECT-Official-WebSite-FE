import { Logo } from "@/components/common/logo";
import { Divider } from "@/components/jds";
import { EXTERNAL_LINKS, JECT_EMAIL } from "@/constants/links";
import { NAVIGATION_SECTIONS } from "@/constants/navigation";

import { FooterLink } from "./FooterLink";
import { FooterMenu } from "./FooterMenu";

const BOTTOM_LINKS = [
  { label: "개인정보처리방침", href: EXTERNAL_LINKS.privacyPolicy },
  { label: "GitHub", href: EXTERNAL_LINKS.github },
  { label: "Instagram", href: EXTERNAL_LINKS.instagram },
];

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-24 bg-surface-deep px-margin-lg pt-40 pb-80">
      <div className="grid w-full max-w-content grid-cols-2 items-start gap-x-24 gap-y-32 tablet:grid-cols-4">
        <div className="flex flex-col items-start gap-16 pt-6">
          <Logo className="h-16 text-object-bold" />
          <address className="text-label-sm font-label-subtle text-object-neutral not-italic">
            {JECT_EMAIL}
          </address>
        </div>
        {NAVIGATION_SECTIONS.map((section) => (
          <FooterMenu key={section.name} section={section} />
        ))}
      </div>

      <div className="flex w-full max-w-content flex-col gap-8">
        <Divider />
        <div className="flex flex-wrap items-start gap-x-16 gap-y-8">
          <span className="text-label-xs font-label-subtle text-object-alternative">
            © {new Date().getFullYear()} JECT. All rights reserved.
          </span>
          <div className="flex flex-wrap items-start gap-x-16 gap-y-8">
            {BOTTOM_LINKS.map(({ label, href }) => (
              <FooterLink key={href} href={href}>
                {label}
              </FooterLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
