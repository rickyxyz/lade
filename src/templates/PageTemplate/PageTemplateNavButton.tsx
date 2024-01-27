import { Paragraph } from "@/components";
import clsx from "clsx";
import Link from "next/link";
import { ReactNode, useMemo } from "react";

interface PageTemplateNavButton {
  className?: string;
  label?: string;
  children?: ReactNode;
  href?: string;
  onClick?: () => void;
}

export function PageTemplateNavButton({
  className,
  label,
  children,
  href,
  onClick,
}: PageTemplateNavButton) {
  const renderButton = useMemo(
    () => (
      <div
        className={clsx(
          "flex items-center px-8 h-full",
          "hover:bg-gray-100 transition-colors",
          className
        )}
        onClick={onClick}
      >
        {children ?? <Paragraph>{label}</Paragraph>}
      </div>
    ),
    [children, className, label, onClick]
  );

  if (href) {
    return (
      <Link href={href} className="h-full">
        {renderButton}
      </Link>
    );
  }

  return renderButton;
}
