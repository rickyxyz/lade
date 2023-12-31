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
    <div className={clsx("grid grid-cols-3 gap-2", className)}>
      <span className="w-40 mt-2">{name}</span>
      {children}
    </div>
  );
}
