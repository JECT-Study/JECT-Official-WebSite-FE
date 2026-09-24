import { useRef, useState } from "react";

import { useMediaQueryFlags } from "@jects/jds/hooks";
import { Outlet, useLocation } from "react-router-dom";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export default function RootLayout() {
  const { key: locationKey } = useLocation();
  const { isDesktop } = useMediaQueryFlags();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [wasDesktop, setWasDesktop] = useState(isDesktop);
  const [lastLocationKey, setLastLocationKey] = useState(locationKey);
  const sidebarTriggerRef = useRef<HTMLButtonElement>(null);

  // 데스크톱 화면으로 전환되면 Radix Dialog가 언마운트되어 onOpenChange가 호출되지 않는다.
  if (isDesktop !== wasDesktop) {
    setWasDesktop(isDesktop);
    if (isDesktop) setIsSidebarOpen(false);
  }

  if (locationKey !== lastLocationKey) {
    setLastLocationKey(locationKey);
    setIsSidebarOpen(false);
  }

  return (
    <div className="flex min-h-dvh bg-surface-standard">
      <Sidebar
        isOpen={isSidebarOpen}
        triggerRef={sidebarTriggerRef}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header triggerRef={sidebarTriggerRef} onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
