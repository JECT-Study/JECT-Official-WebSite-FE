"use client";

import { DropdownMenu } from "@jects/jds";

import { LeaveConfirmLink } from "@/components/common/leave-confirm-link/LeaveConfirmLink";
import type { NavigationLink } from "@/constants/navigation";

interface MenuLinkItemProps {
  link: NavigationLink;
}

export function MenuLinkItem({ link }: MenuLinkItemProps) {
  if (link.isExternal) {
    return (
      <DropdownMenu.Anchor
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        suffixIcon="external-link"
        suffixIconVisible
      >
        {link.label}
      </DropdownMenu.Anchor>
    );
  }

  return (
    <DropdownMenu.Anchor asChild>
      <LeaveConfirmLink href={link.href}>{link.label}</LeaveConfirmLink>
    </DropdownMenu.Anchor>
  );
}
