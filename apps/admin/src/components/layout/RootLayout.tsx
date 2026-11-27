import { useEffect, useState } from "react";

import { useMediaQueryFlags } from "@jects/jds/hooks";
import { Outlet, useLocation } from "react-router-dom";

import { dismissDialog } from "@/stores/dialogStore";

import { Header } from "./Header";
import { HeaderActionSlotContext } from "./HeaderActionSlotContext";
import { Sidebar } from "./Sidebar";

export default function RootLayout() {
  const { key: locationKey, pathname } = useLocation();
  const { isDesktop } = useMediaQueryFlags();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [wasDesktop, setWasDesktop] = useState(isDesktop);
  const [lastLocationKey, setLastLocationKey] = useState(locationKey);
  const [headerActionSlot, setHeaderActionSlot] = useState<HTMLDivElement | null>(null);

  // 데스크톱 화면으로 전환되면 Radix Dialog가 언마운트되어 onOpenChange가 호출되지 않는다.
  if (isDesktop !== wasDesktop) {
    setWasDesktop(isDesktop);
    if (isDesktop) setIsSidebarOpen(false);
  }

  if (locationKey !== lastLocationKey) {
    setLastLocationKey(locationKey);
    setIsSidebarOpen(false);
  }

  // 공용 다이얼로그는 라우터 바깥에 렌더링되어 페이지를 옮겨도 남으므로 경로가 바뀌면 닫는다.
  useEffect(() => dismissDialog, [pathname]);

  return (
    <div className="flex min-h-dvh bg-surface-standard">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} actionSlotRef={setHeaderActionSlot} />
        <main className="flex flex-1 flex-col">
          <HeaderActionSlotContext value={headerActionSlot}>
            <Outlet />
          </HeaderActionSlotContext>
        </main>
      </div>
    </div>
  );
}
