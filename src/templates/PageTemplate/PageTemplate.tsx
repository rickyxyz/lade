import { ReactNode } from "react";
import clsx from "clsx";

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
      <section className="flex flex-col md:flex-row w-full gap-8">
        <article className={clsx("h-full w-full", className)}>
          {children}
        </article>
        {side}
      </section>
    </main>
  );
}
