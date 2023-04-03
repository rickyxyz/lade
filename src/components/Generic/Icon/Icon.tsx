import { ComponentType, useMemo } from "react";
import { IconNameType } from "@/types";
import { ICONS } from "@/consts";
import clsx from "clsx";

type Base = { className: string };

export interface IconProps {
  className?: string;
  icon: IconNameType;
  filled?: boolean;
}

export const injectPropsToIcon = <TProps extends Base>(
  Component: ComponentType<TProps>
) => {
  // eslint-disable-next-line react/display-name
  return (props: TProps & { className: string }) => {
    return <Component {...props} />;
  };
};

const IconBase = (any: any) => injectPropsToIcon(any);

export function Icon({ className = "", icon, filled }: IconProps) {
  const component = useMemo(() => ICONS[icon], [icon]);

  const IconComponent = useMemo(() => IconBase(component), [component]);

  return <IconComponent className={clsx(ICON_STYLE, className)} />;
}

const ICON_STYLE = "h-6 w-6";
