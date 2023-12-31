import clsx from "clsx";
import { ReactNode } from "react";
import { PageTemplateSide } from "./PageTemplateSide";

export interface PageTemplateProps {
  className?: string;
  head?: ReactNode;
  children?: ReactNode;
  side?: ReactNode;
  footer?: ReactNode;
  hideSidebar?: boolean;
}

export function PageTemplate({
  className,
  children,
  head,
  side,
}: PageTemplateProps) {
  return (
    <main className="flex flex-col relative w-adaptive-2 mx-auto py-12">
      {head}
      <section className="flex w-full gap-8">
        <article className={clsx("h-full w-full", className)}>
          {children}
        </article>
        {side}
      </section>
    </main>
  );
}
