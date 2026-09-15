import LogoIcon from "@/assets/svg/logo.svg";
import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <LogoIcon
      role="img"
      aria-label="젝트"
      className={cn("w-auto text-object-boldest", className)}
    />
  );
}
