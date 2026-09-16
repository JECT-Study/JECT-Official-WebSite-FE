"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { Menu } from "@jects/jds";

import type { NavigationLink } from "@/constants/navigation";

interface SidebarLinkItemProps {
  link: NavigationLink;
  onNavigate: () => void;
}

export function SidebarLinkItem({ link, onNavigate }: SidebarLinkItemProps) {
  const router = useRouter();

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

  // NOTE: Menu.Anchor에 asChild가 없어 이동을 라우터가 맡는다.
  // TODO: JDS가 asChild를 지원하면 next/link로 교체한다.
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate();
    router.push(link.href);
  };

  return (
    <Menu.Anchor href={link.href} onClick={handleClick}>
      {link.label}
    </Menu.Anchor>
  );
}
