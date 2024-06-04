"use client";
import { ReactNode, useEffect, useRef } from "react";
import clsx from "clsx";
import { Paragraph } from "@/components";
import { useDevice } from "@/hooks";
import { PageTemplateNav } from "./PageTemplateNav";

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
  const { device } = useDevice();

  return (
    <div
      className={clsx(
        "relative h-full flex flex-auto overflow-hidden",
        device === "desktop" ? "flex-row" : "flex-col-reverse"
      )}
    >
      <PageTemplateNav />
      <main className="w-full flex flex-auto overflow-hidden flex-col bg-secondary-100">
        <div
          className={clsx(
            "flex gap-2",
            "w-full py-3 px-8 bg-white",
            "border-b border-secondary-300"
          )}
        >
          {leftTitle}
          <Paragraph size="m" weight="semibold">
            {title}
          </Paragraph>
        </div>
        <section className="flex flex-col overflow-x-hidden overflow-y-auto p-8">
          {head}
          {children}
        </section>
      </main>
    </div>
  );
}
