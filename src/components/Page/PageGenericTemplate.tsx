import { ReactNode } from "react";

export interface PageGenericTemplateProps {
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}

export function PageGenericTemplate({
  header,
  children,
  footer,
}: PageGenericTemplateProps) {
  return (
    <main className="w-full h-full">
      {header}
      {children}
      {footer}
    </main>
  );
}
