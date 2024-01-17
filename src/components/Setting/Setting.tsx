import clsx from "clsx";
import { ReactNode } from "react";

interface SettingProps {
  formName?: string;
  name?: string;
  className?: string;
  children?: ReactNode;
}

export function Setting({ name, children, className }: SettingProps) {
  return (
    <div className={clsx("flex flex-col md:flex-row", className)}>
      <span className="w-40 mt-2 text-gray-500">{name}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
