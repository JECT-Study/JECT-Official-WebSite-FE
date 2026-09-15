"use client";

import { Menu } from "@jects/jds";

import type { NavigationSection } from "@/constants/navigation";

import { FooterMenuLink } from "./FooterMenuLink";

interface FooterMenuProps {
  section: NavigationSection;
}

export function FooterMenu({ section }: FooterMenuProps) {
  return (
    <nav aria-label={section.name}>
      <Menu.Root size="sm">
        <Menu.Content className="px-0">
          <Menu.Category as="span">{section.name}</Menu.Category>
          <Menu.Group>
            {section.links.map((link) => (
              <FooterMenuLink key={link.href} link={link} />
            ))}
          </Menu.Group>
        </Menu.Content>
      </Menu.Root>
    </nav>
  );
}
