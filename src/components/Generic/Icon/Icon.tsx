import { ComponentType, useMemo } from "react";
import { IconNameType } from "@/types";
import { ICONS } from "@/consts";
import clsx from "clsx";

type Base = { className: string };

type IconSizeType = "lg" | "md" | "sm";

export interface IconProps {
  className?: string;
  icon: IconNameType;
  filled?: boolean;
  size?: IconSizeType;
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

export function Icon({ className = "", icon, size = "md" }: IconProps) {
  const component = useMemo(() => ICONS[icon], [icon]);

  const IconComponent = useMemo(() => IconBase(component), [component]);

  return <IconComponent className={clsx(ICON_SIZE_STYLE[size], className)} />;
}

const ICON_SIZE_STYLE: Record<IconSizeType, string> = {
  lg: "h-8 w-8",
  md: "h-6 w-6",
  sm: "h-4 w-4",
};
