import { PageTemplate } from "@/templates";
import clsx from "clsx";
import { ReactNode } from "react";

interface ContestDetailTemplateProps {
  title?: string;
  mainElement?: ReactNode;
  sideElement?: ReactNode;
  errorElement?: ReactNode;
  isError?: boolean;
}

export function ContestDetailTemplate({
  title,
  mainElement,
  sideElement,
  errorElement,
  isError,
}: ContestDetailTemplateProps) {
  const showError = isError && errorElement;

  return (
    <PageTemplate title={title} className="w-full">
      {showError ? (
        errorElement
      ) : (
        <div className="relative flex flex-row flex-wrap gap-8">
          {mainElement}
          <div
            className={clsx(
              "flex flex-col flex-grow gap-8 ",
              "md:max-w-[320px] h-fit lg:sticky lg:top-0"
            )}
          >
            {sideElement}
          </div>
        </div>
      )}
    </PageTemplate>
  );
}
