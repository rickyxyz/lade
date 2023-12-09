import clsx from "clsx";
import { ReactNode } from "react";
import { PageTemplateSide } from "./PageTemplateSide";

export interface PageTemplateProps {
  className?: string;
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  hideSidebar?: boolean;
}

export function PageTemplate({ className, children }: PageTemplateProps) {
  return (
    <div className="flex relative mx-auto gap-8 px-8">
      <PageTemplateSide />
      <main className={clsx("w-adaptive-2 mt-8 h-full", className)}>
        {children}
      </main>
    </div>
  );
}
