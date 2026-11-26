"use client";

import { Menu } from "@jects/jds";

import { LeaveConfirmLink } from "@/components/common/leave-confirm-link/LeaveConfirmLink";
import type { NavigationLink } from "@/constants/navigation";

interface SidebarLinkItemProps {
  link: NavigationLink;
  onNavigate: () => void;
}

export function SidebarLinkItem({ link, onNavigate }: SidebarLinkItemProps) {
  if (link.isExternal) {
    return (
      <Menu.Anchor
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        suffixIcon="external-link"
        suffixIconVisible
      >
        {link.label}
      </Menu.Anchor>
    );
  }

  return (
    <Menu.Anchor asChild onClick={onNavigate}>
      <LeaveConfirmLink href={link.href}>{link.label}</LeaveConfirmLink>
    </Menu.Anchor>
  );
}
