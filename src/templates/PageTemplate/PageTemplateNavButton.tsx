import { Icon, Paragraph } from "@/components";
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
  onClick?: () => void;
}

export function PageTemplateNavButton({
  className,
  label,
  children,
  icon,
  href,
  active,
  onClick,
}: PageTemplateNavButton) {
  const renderButton = useMemo(
    () => (
      <div
        className={clsx(
          "flex items-center px-4 py-2 rounded-md",
          "hover:bg-blue-100 transition-colors",
          active ? "bg-blue-100 text-blue-700" : "text-gray-700",
          className
        )}
        onClick={onClick}
      >
        {icon && (
          <Icon
            className="mr-2"
            IconComponent={icon}
            size="l"
            color="inherit"
          />
        )}
        {children ?? <Paragraph color="inherit">{label}</Paragraph>}
      </div>
    ),
    [active, children, className, icon, label, onClick]
  );

  if (href) {
    return <Link href={href}>{renderButton}</Link>;
  }

  return renderButton;
}
