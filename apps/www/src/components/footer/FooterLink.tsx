import { Icon } from "@/components/jds";

interface FooterLinkProps {
  href: string;
  children: string;
}

export function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-4 text-label-xs font-label-normal text-object-neutral hover:text-object-bold"
    >
      {children}
      <Icon name="external-link" size="2xs" />
    </a>
  );
}
