import { ReactNode } from "react";
import clsx from "clsx";
import { PageTemplateNavNew } from "./PageTemplateNavNew";
import { Paragraph } from "@/components";

export interface PageTemplateProps {
  className?: string;
  title?: string;
  head?: ReactNode;
  children?: ReactNode;
  side?: ReactNode;
  footer?: ReactNode;
  hideSidebar?: boolean;
}

export function PageTemplate({
  title = "Title",
  className,
  children,
  head,
  side,
}: PageTemplateProps) {
  return (
    <div
      className={clsx(
        "relative h-full flex flex-row flex-auto overflow-hidden"
      )}
    >
      <PageTemplateNavNew />
      <main className="flex flex-col w-full bg-gray-100">
        <div className="w-full py-3 px-8 bg-white border-b border-gray-300">
          <Paragraph size="m" weight="semibold">
            {title}
          </Paragraph>
        </div>
        <section className="flex flex-col w-full overflow-y-scroll p-8">
          {head}
          {children}
        </section>
      </main>
    </div>
  );
}
