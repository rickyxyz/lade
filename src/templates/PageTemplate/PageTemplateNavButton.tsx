import { Icon, Paragraph } from "@/components";
import { DeviceScreenType } from "@/types";
import { SvgIconComponent } from "@mui/icons-material";
import clsx from "clsx";
import Link from "next/link";
import { ReactNode, useMemo } from "react";

interface PageTemplateNavButton {
  className?: string;
  label?: string;
  children?: ReactNode;
  icon?: SvgIconComponent;
  href?: string;
  active?: boolean;
  device?: DeviceScreenType;
  danger?: boolean;
  onClick?: () => void;
}

export function PageTemplateNavButton({
  className,
  label,
  device,
  icon,
  href,
  active,
  danger,
  onClick,
}: PageTemplateNavButton) {
  const renderButton = useMemo(
    () => (
      <div
        className={clsx(
          "flex items-center rounded-md",
          danger
            ? [
                "hover:bg-red-100 transition-colors",
                active ? "bg-red-100 text-red-600" : "text-red-600",
              ]
            : [
                "hover:bg-blue-100 transition-colors",
                active ? "bg-blue-100 text-blue-600" : "text-gray-600",
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
    [active, className, device, icon, label, onClick]
  );

  if (href) {
    return <Link href={href}>{renderButton}</Link>;
  }

  return renderButton;
}
