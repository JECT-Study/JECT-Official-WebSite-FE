import type { MouseEvent } from "react";

import { Menu } from "@jects/jds";
import { useNavigate } from "react-router-dom";

import type { NavigationLink } from "@/constants/navigation";

interface SidebarLinkItemProps {
  link: NavigationLink;
  isSelected: boolean;
}

export function SidebarLinkItem({ link, isSelected }: SidebarLinkItemProps) {
  const navigate = useNavigate();

  // NOTE: Menu.Anchor에 asChild가 없어 이동을 라우터가 맡는다.
  // TODO: JDS가 asChild를 지원하면 react-router의 Link로 교체한다.
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate(link.href);
  };

  return (
    <Menu.Anchor href={link.href} isSelected={isSelected} onClick={handleClick}>
      {link.label}
    </Menu.Anchor>
  );
}
