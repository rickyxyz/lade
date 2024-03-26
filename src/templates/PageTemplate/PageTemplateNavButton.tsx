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

export function PageTemplateNavButton({
  className,
  label,
  device,
  icon,
  href,
  isActive,
  isDanger,
  onClick,
}: PageTemplateNavButton) {
  const renderButton = useMemo(
    () => (
      <div
        className={clsx(
          "flex items-center rounded-md transition-colors",
          isDanger
            ? [
                "hover:bg-red-100",
                isActive ? "bg-red-100 text-red-600" : "text-red-600",
              ]
            : [
                "hover:bg-blue-100",
                isActive ? "bg-blue-100 text-blue-600" : "text-gray-600",
              ],
          device === "desktop" ? "px-4 h-10" : "p-2 h-10 w-10",
          className
        )}
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
        {label && device === "desktop" && (
          <Paragraph color="inherit">{label}</Paragraph>
        )}
      </div>
    ),
    [isDanger, isActive, device, className, onClick, icon, label]
  );

  if (href) {
    return <Link href={href}>{renderButton}</Link>;
  }

  return renderButton;
}
