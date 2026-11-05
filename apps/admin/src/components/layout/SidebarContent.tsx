import { Fragment } from "react";

import { Divider, Icon, LabelButton, Menu, useToast } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

import { authApi } from "@/apis/auth/api";
import { findActiveLink, NAVIGATION_SECTIONS } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";

import { SidebarLinkItem } from "./SidebarLinkItem";

export function SidebarContent() {
  const { pathname } = useLocation();
  const activeLink = findActiveLink(pathname);
  const { toast } = useToast();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      useAuthStore.getState().setIsLoggedIn(false);
      // 라우터로 이동하면 ProtectedRoute나 GuestRoute가 먼저 반응해 다른 경로로 보낸다.
      window.location.replace(ROUTES.login);
    },
    onError: () => {
      toast.destructive("로그아웃에 실패했어요", { description: "잠시 후 다시 시도해주세요." });
    },
  });

  const handleLogout = () => {
    if (isPending) return;
    logout();
  };

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
          <LabelButton hierarchy="tertiary" size="sm" disabled={isPending} onClick={handleLogout}>
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
