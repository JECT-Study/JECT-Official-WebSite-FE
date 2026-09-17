"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { DropdownMenu } from "@jects/jds";

import type { NavigationLink } from "@/constants/navigation";

interface MenuLinkItemProps {
  link: NavigationLink;
}

export function MenuLinkItem({ link }: MenuLinkItemProps) {
  const router = useRouter();

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

  // NOTE: DropdownMenu.Anchor에 asChild가 없어 이동을 라우터가 맡는다.
  // TODO: JDS가 asChild를 지원하면 next/link로 교체한다.
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    router.push(link.href);
  };

  return (
    <DropdownMenu.Anchor href={link.href} onClick={handleClick}>
      {link.label}
    </DropdownMenu.Anchor>
  );
}
