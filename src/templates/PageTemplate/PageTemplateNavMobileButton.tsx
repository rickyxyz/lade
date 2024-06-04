import { Icon, Paragraph } from "@/components";
import { DeviceScreenType } from "@/types";
import { SvgIconComponent } from "@mui/icons-material";
import clsx from "clsx";
import Link from "next/link";
import { ReactNode, useMemo } from "react";

interface PageTemplateNavButton {
  icon?: SvgIconComponent;
  device?: DeviceScreenType;
  className?: string;
  label?: string;
  href?: string;
  isActive?: boolean;
  isDanger?: boolean;
  onClick?: () => void;
}

export function PageTemplateNavMobileButton({
  className,
  label,
  device,
  icon,
  href,
  isActive,
  isDanger,
  onClick,
}: PageTemplateNavButton) {
  const renderButton = useMemo(() => (
    <div
      role="button"
      className={clsx("flex flex-col items-center gap-1 p-4", isActive ? "text-blue-500" : "text-gray-600")}
      onClick={onClick}
    >
      {icon && (
        <Icon
          className={clsx(device === "desktop" && "mr-2")}
          IconComponent={icon}
          size="l"
          color="inherit"
        />
      )}
      {label && (
        <Paragraph size="s" color="inherit">{label}</Paragraph>
      )}
    </div>
  ), [device, icon, isActive, label, onClick])

  if (href) {
    return <Link className="w-fit" href={href}>{renderButton}</Link>;
  }

  return renderButton;
}
