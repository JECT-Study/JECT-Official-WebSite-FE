import { Menu } from "@jects/jds";
import { Link } from "react-router-dom";

import type { NavigationLink } from "@/constants/navigation";

interface SidebarLinkItemProps {
  link: NavigationLink;
  isSelected: boolean;
}

export function SidebarLinkItem({ link, isSelected }: SidebarLinkItemProps) {
  return (
    <Menu.Anchor asChild isSelected={isSelected}>
      <Link to={link.href}>{link.label}</Link>
    </Menu.Anchor>
  );
}
