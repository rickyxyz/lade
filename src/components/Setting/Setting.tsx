import clsx from "clsx";
import { ReactNode } from "react";
import { Paragraph } from "../Paragraph";

interface SettingProps {
  formName?: string;
  name?: string;
  className?: string;
  classNameChildren?: string;
  children?: ReactNode;
  row?: boolean;
}

export function Setting({
  name,
  children,
  className,
  classNameChildren,
}: SettingProps) {
  return (
    <div className={clsx("flex flex-col", className)}>
      <Paragraph className="w-40 mt-2" color="secondary-5">
        {name}
      </Paragraph>
      <div className={clsx("flex-1", classNameChildren)}>{children}</div>
    </div>
  );
}
