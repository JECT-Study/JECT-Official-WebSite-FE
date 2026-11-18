"use client";

import Link from "next/link";

import { Menu } from "@jects/jds";

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
      <Link href={link.href}>{link.label}</Link>
    </Menu.Anchor>
  );
}
