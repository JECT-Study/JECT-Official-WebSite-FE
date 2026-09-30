"use client";

import Link from "next/link";

import { DropdownMenu } from "@jects/jds";

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
      <Link href={link.href}>{link.label}</Link>
    </DropdownMenu.Anchor>
  );
}
