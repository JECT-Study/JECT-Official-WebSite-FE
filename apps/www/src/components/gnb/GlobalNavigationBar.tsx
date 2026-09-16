"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { BlockButton, Divider, DropdownMenu, IconButton, SegmentedControls } from "@jects/jds";

import { Logo } from "@/components/common/logo";
import { NAVIGATION_SECTIONS } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/utils/cn";

import { MenuLinkItem } from "./MenuLinkItem";
import { Sidebar } from "./Sidebar";
import { useGlobalNavigationVariant } from "./useGlobalNavigationVariant";

const MENU_CLOSE_DELAY_MS = 150;

export function GlobalNavigationBar() {
  const pathname = usePathname();
  const router = useRouter();

  const variant = useGlobalNavigationVariant();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoverOpen = useRef(false);

  useEffect(() => () => clearTimeout(closeTimer.current ?? undefined), []);

  const isOnHero = variant === "empty" && pathname === ROUTES.main;
  const heroTextClass = isOnHero ? "text-system-white!" : "";
  const heroButtonClass = isOnHero ? "bg-surface-static-deepest! text-object-static-boldest!" : "";

  const handleApplyClick = () => router.push(ROUTES.applyList);

  const openMenu = (name: string) => {
    clearTimeout(closeTimer.current ?? undefined);
    isHoverOpen.current = true;
    setOpenSection(name);
  };

  const closeMenuLater = () => {
    clearTimeout(closeTimer.current ?? undefined);
    closeTimer.current = setTimeout(() => setOpenSection(null), MENU_CLOSE_DELAY_MS);
  };

  const handleOpenChange = (name: string, open: boolean) => {
    if (!open) {
      setOpenSection((current) => (current === name ? null : current));
      return;
    }

    clearTimeout(closeTimer.current ?? undefined);
    isHoverOpen.current = false;
    setOpenSection(name);
  };

  const preventHoverFocus = (event: Event) => {
    if (isHoverOpen.current) event.preventDefault();
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-floated">
      <header
        className={cn(
          "pointer-events-auto flex w-full justify-center px-margin-lg py-margin-sm tablet:py-10 desktop:py-12",
          variant === "solid" && "border-b border-stroke-subtle bg-surface-shallow"
        )}
      >
        <nav
          aria-label="주요 메뉴"
          className="relative flex h-20 w-full max-w-content items-center tablet:h-[26px] tablet:gap-20 desktop:h-32 desktop:gap-24"
        >
          <Link href={ROUTES.main} aria-label="젝트 홈" className="flex items-center">
            <Logo className={cn("h-[14px] desktop:h-16", heroTextClass)} />
          </Link>

          <div className="hidden h-[18px] tablet:block desktop:h-20">
            <Divider orientation="vertical" />
          </div>

          <ul role="list" className="hidden items-center gap-16 whitespace-nowrap tablet:flex">
            {NAVIGATION_SECTIONS.map((section) => (
              <li
                key={section.name}
                onMouseEnter={() => openMenu(section.name)}
                onMouseLeave={closeMenuLater}
              >
                <DropdownMenu.Root
                  size="md"
                  modal={false}
                  open={openSection === section.name}
                  onOpenChange={(open) => handleOpenChange(section.name, open)}
                >
                  <DropdownMenu.Trigger asChild>
                    <BlockButton
                      hierarchy="primary"
                      variant="hollow"
                      size="md"
                      className={heroTextClass}
                    >
                      {section.name}
                    </BlockButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content
                    className="w-[160px]"
                    align="start"
                    sideOffset={20}
                    onCloseAutoFocus={preventHoverFocus}
                  >
                    <DropdownMenu.Group>
                      {section.links.map((link) => (
                        <MenuLinkItem key={link.href} link={link} />
                      ))}
                    </DropdownMenu.Group>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </li>
            ))}
          </ul>

          <div className="flex flex-1 items-center justify-end gap-16">
            {variant === "solid" && (
              <div className="hidden w-[120px] tablet:block">
                <SegmentedControls.Root
                  value={theme}
                  size="xs"
                  onValueChange={(value) => setTheme(value === "dark" ? "dark" : "light")}
                >
                  <SegmentedControls.Item value="light">라이트</SegmentedControls.Item>
                  <SegmentedControls.Item value="dark">다크</SegmentedControls.Item>
                </SegmentedControls.Root>
              </div>
            )}

            <BlockButton
              hierarchy="primary"
              size="sm"
              onClick={handleApplyClick}
              className={cn("hidden tablet:inline-flex", heroButtonClass)}
            >
              지원하기
            </BlockButton>
            <BlockButton
              hierarchy="primary"
              size="xs"
              onClick={handleApplyClick}
              className={cn("tablet:hidden", heroButtonClass)}
            >
              지원하기
            </BlockButton>

            <IconButton
              hierarchy="primary"
              icon="menu"
              size="lg"
              aria-label="메뉴 열기"
              onClick={() => setIsSidebarOpen(true)}
              className={cn("tablet:hidden", heroTextClass)}
            />
          </div>

          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </nav>
      </header>
    </div>
  );
}
