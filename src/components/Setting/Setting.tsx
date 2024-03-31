import clsx from "clsx";
import { ReactNode } from "react";

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
    <div className={clsx("flex flex-col md:flex-row", className)}>
      <span className="w-40 mt-2 text-secondary-500">{name}</span>
      <div className={clsx("flex-1", classNameChildren)}>{children}</div>
    </div>
  );
}
