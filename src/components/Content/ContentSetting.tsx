import clsx from "clsx";
import { ReactNode } from "react";

interface ContentSettingProps {
  formName?: string;
  name?: string;
  className?: string;
  children?: ReactNode;
}

export function ContentSetting({
  name,
  children,
  className,
}: ContentSettingProps) {
  return (
    <div className={clsx("grid grid-cols-3 gap-2 items-center", className)}>
      <span className="w-40">{name}</span>
      {children}
    </div>
  );
}
