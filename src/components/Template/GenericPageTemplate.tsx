import clsx from "clsx";
import { ReactNode } from "react";
import { Sidebar } from "../Layout";

export interface GenericPageTemplateProps {
  className?: string;
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  hideSidebar?: boolean;
}

export function GenericPageTemplate({
  className,
  header,
  children,
  footer,
  hideSidebar = false,
}: GenericPageTemplateProps) {
  return (
    <div className="flex relative mx-auto gap-8 px-8">
      {!hideSidebar && <Sidebar />}
      <main className={clsx("w-adaptive-2 mt-8 h-full", className)}>
        {header}
        {children}
        {footer}
      </main>
    </div>
  );
}
