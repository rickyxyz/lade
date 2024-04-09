import { FONT_COLOR, FontColor } from "@/consts/style";
import clsx from "clsx";
import { CSSProperties, useMemo } from "react";
import { SvgIconComponent } from "@mui/icons-material";

export type IconSizeType = "l" | "m" | "s" | "xs";

export interface IconProps {
  IconComponent: SvgIconComponent;
  className?: string;
  color?: FontColor;
  size?: IconSizeType;
}
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
        sizePx = "24px";
        break;
      case "m":
        sizePx = "16px";
        break;
      case "s":
        sizePx = "12px";
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
