import clsx from "clsx";
import { ReactNode } from "react";
import { PageTemplateSide } from "./PageTemplateSide";

export interface PageTemplateProps {
  className?: string;
  header?: ReactNode;
  children?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  hideSidebar?: boolean;
}

export function PageTemplate({
  className,
  children,
  sidebar,
}: PageTemplateProps) {
  return (
    <div className="flex relative w-adaptive-2 mx-auto gap-8 px-8">
      <main className={clsx("mt-8 h-full", className)}>{children}</main>
      {sidebar}
      {/* {!hideSidebar && <PageTemplateSide />} */}
    </div>
  );
}
