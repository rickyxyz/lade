"use client";
import { ReactNode, useEffect, useRef } from "react";
import clsx from "clsx";
import { PageTemplateNav } from "./PageTemplateNav";
import { Paragraph } from "@/components";

export interface PageTemplateProps {
  className?: string;
  title?: string;
  leftTitle?: ReactNode;
  head?: ReactNode;
  children?: ReactNode;
  side?: ReactNode;
  footer?: ReactNode;
}

export function PageTemplate({
  title = "Title",
  leftTitle,
  className,
  children,
  head,
}: PageTemplateProps) {
  return (
    <div
      className={clsx(
        "relative h-full flex flex-row flex-auto overflow-hidden"
      )}
    >
      <PageTemplateNav />
      <main className="w-full flex flex-auto overflow-hidden flex-col bg-secondary-100">
        <div
          className={clsx(
            "flex",
            "w-full py-3 px-8 bg-white",
            "border-b border-secondary-300"
          )}
        >
          {leftTitle}
          <Paragraph size="m" weight="semibold">
            {title}
          </Paragraph>
        </div>
        <section className="flex flex-col overflow-y-auto p-8">
          {head}
          {children}
        </section>
      </main>
    </div>
  );
}
