import { ReactNode } from "react";

interface ContentSettingProps {
  formName: string;
  name: string;
  children?: ReactNode;
}

export function ContentSetting({ name, children }: ContentSettingProps) {
  return (
    <div className="grid grid-cols-3 gap-2 items-center">
      <span className="w-40">{name}</span>
      {children}
    </div>
  );
}
