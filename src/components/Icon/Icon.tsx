import { FONT_COLOR, FontColor } from "@/consts/style";
import clsx from "clsx";
import { CSSProperties, useMemo } from "react";
import { IconType, IconBaseProps as IconLibProps } from "react-icons";

interface IconBaseProps {
  IconComponent: IconType;
  color?: FontColor;
  size?: "s" | "s-alt" | "m" | "l-alt" | "l";
}

export type IconProps = IconBaseProps & Omit<IconLibProps, keyof IconBaseProps>;

export function Icon({
  IconComponent,
  className,
  color,
  size,
  ...rest
}: IconProps) {
  const style = useMemo<CSSProperties>(() => {
    let sizePx = "16px";

    switch (size) {
      case "l":
        sizePx = "32px";
        break;
      case "l-alt":
        sizePx = "28px";
        break;
      case "m":
        sizePx = "24px";
        break;
      case "s":
        sizePx = "16px";
        break;
      case "s-alt":
        sizePx = "8px";
        break;
    }

    return {
      minWidth: sizePx,
      maxWidth: sizePx,
      minHeight: sizePx,
      maxHeight: sizePx,
    };
  }, [size]);

  return (
    <IconComponent
      className={clsx(color && FONT_COLOR[color], className)}
      {...rest}
      style={style}
    />
  );
}
