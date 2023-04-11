import { CSSProperties, ComponentType, useMemo } from "react";
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
  return (props: TProps & { className: string; style: CSSProperties }) => {
    return <Component {...props} />;
  };
};

const IconBase = (any: any) => injectPropsToIcon(any);

export function Icon({ className = "", icon, size = "md" }: IconProps) {
  const component = useMemo(() => ICONS[icon], [icon]);

  const IconComponent = useMemo(() => IconBase(component), [component]);

  return (
    <IconComponent className={className} style={ICON_SIZE_INLINE_STYLE[size]} />
  );
}

const ICON_SIZE_INLINE_STYLE: Record<IconSizeType, CSSProperties> = {
  lg: {
    width: "2rem",
    height: "2rem",
    minWidth: "2rem",
    minHeight: "2rem",
  },
  md: {
    width: "1.5rem",
    height: "1.5rem",
    minWidth: "1.5rem",
    minHeight: "1.5rem",
  },
  sm: {
    width: "1rem",
    height: "1rem",
    minWidth: "1rem",
    minHeight: "1rem",
  },
};
