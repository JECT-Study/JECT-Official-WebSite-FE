import { Fragment } from "react";

import { Divider, Icon, LabelButton, Menu } from "@jects/jds";
import { useLocation } from "react-router-dom";

import { findActiveLink, NAVIGATION_SECTIONS } from "@/constants/navigation";

import { SidebarLinkItem } from "./SidebarLinkItem";

interface SidebarContentProps {
  onNavigate: () => void;
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const { pathname } = useLocation();
  const activeLink = findActiveLink(pathname);

  return (
    <>
      <div className="w-full border-b border-stroke-assistive bg-surface-shallower">
        <div className="px-margin-md pt-margin-lg pb-8">
          <p className="text-label-lg font-label-bold text-object-boldest">젝트 백오피스</p>
        </div>
        <div className="flex items-center gap-16 px-margin-md pt-10 pb-16">
          <div className="flex min-w-0 flex-1 items-center gap-6">
            <Icon name="circle-user-round" size="xs" className="text-object-alternative" />
            <p className="truncate text-label-sm text-object-bolder">계정명</p>
          </div>
          <LabelButton hierarchy="tertiary" size="sm">
            로그아웃
          </LabelButton>
        </div>
      </div>

      <nav aria-label="주요 메뉴" className="flex-1 overflow-y-auto px-margin-sm py-margin-md">
        <Menu.Root size="md">
          <div className="flex flex-col gap-20 pb-margin-3xl">
            {NAVIGATION_SECTIONS.map((section, index) => (
              <Fragment key={section.name}>
                {index > 0 && <Divider />}
                <Menu.Content className="p-0">
                  <Menu.Category as="span">{section.name}</Menu.Category>
                  <Menu.Group>
                    {section.links.map((link) => (
                      <SidebarLinkItem
                        key={link.href}
                        link={link}
                        isSelected={link === activeLink}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </Menu.Group>
                </Menu.Content>
              </Fragment>
            ))}
          </div>
        </Menu.Root>
      </nav>
    </>
  );
}
