"use client";

import Link from "next/link";

import { Menu } from "@jects/jds";

import type { NavigationLink } from "@/constants/navigation";

interface FooterMenuLinkProps {
  link: NavigationLink;
}

export function FooterMenuLink({ link }: FooterMenuLinkProps) {
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
    <Menu.Anchor asChild>
      <Link href={link.href}>{link.label}</Link>
    </Menu.Anchor>
  );
}
