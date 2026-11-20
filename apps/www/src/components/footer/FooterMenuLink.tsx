"use client";

import Link from "next/link";

import { MenuAnchor } from "@jects/jds";

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
      <Link href={link.href}>{link.label}</Link>
    </MenuAnchor>
  );
}
