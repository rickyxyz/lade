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
  onClick?: () => void;
}

export function PageTemplateNavButton({
  className,
  label,
  children,
  device,
  icon,
  href,
  active,
  onClick,
}: PageTemplateNavButton) {
  const renderButton = useMemo(
    () => (
      <div
        className={clsx(
          "flex items-center rounded-md",
          "hover:bg-blue-100 transition-colors",
          active ? "bg-blue-100 text-blue-700" : "text-gray-700",
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
