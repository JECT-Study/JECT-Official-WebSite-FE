"use client";

import { MenuAnchor } from "@jects/jds";

import { LeaveConfirmLink } from "@/components/common/leave-confirm-link/LeaveConfirmLink";
import type { NavigationLink } from "@/constants/navigation";

interface FooterMenuLinkProps {
  link: NavigationLink;
}

export function FooterMenuLink({ link }: FooterMenuLinkProps) {
  if (link.isExternal) {
    return (
      <MenuAnchor
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        suffixIcon="external-link"
        suffixIconVisible
      >
        {link.label}
      </MenuAnchor>
    );
  }

  return (
    <MenuAnchor asChild>
      <LeaveConfirmLink href={link.href}>{link.label}</LeaveConfirmLink>
    </MenuAnchor>
  );
}
