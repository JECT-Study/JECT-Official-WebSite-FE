"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { confirmLeave, isLeaveConfirmEnabled } from "@/hooks/apply/useLeaveConfirm";

interface LeaveConfirmLinkProps extends Omit<ComponentProps<typeof Link>, "href"> {
  href: string;
}

export function LeaveConfirmLink({ href, ...props }: LeaveConfirmLinkProps) {
  const router = useRouter();

  return (
    <Link
      {...props}
      href={href}
      onNavigate={(event) => {
        if (!isLeaveConfirmEnabled()) {
          return;
        }

        event.preventDefault();
        void confirmLeave().then((shouldLeave) => {
          if (shouldLeave) {
            router.push(href);
          }
        });
      }}
    />
  );
}
