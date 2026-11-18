import { MenuCategory, MenuContent, MenuGroup, MenuRoot } from "@jects/jds";

import type { NavigationSection } from "@/constants/navigation";

import { FooterMenuLink } from "./FooterMenuLink";

interface FooterMenuProps {
  section: NavigationSection;
}

export function FooterMenu({ section }: FooterMenuProps) {
  return (
    <nav aria-label={section.name}>
      <MenuRoot size="sm">
        <MenuContent className="px-0">
          <MenuCategory as="span">{section.name}</MenuCategory>
          <MenuGroup>
            {section.links.map((link) => (
              <FooterMenuLink key={link.href} link={link} />
            ))}
          </MenuGroup>
        </MenuContent>
      </MenuRoot>
    </nav>
  );
}
