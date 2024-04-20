import clsx from "clsx";
import { FONT_COLOR, FontColor } from "@/consts/style";

type LoaderSize = "sm" | "md";

interface LoaderProps {
  frontColor?: FontColor;
  backColor?: FontColor;
  size?: LoaderSize;
}

export function Spinner({
  frontColor = "primary-6",
  backColor = "secondary-3",
  size = "md",
}: LoaderProps) {
  return (
    <div className={clsx("lds-ring !border-0", LOADER_SIZE_STYLE[size])}>
      <div
        className={clsx(
          "lds-ring-back",
          FONT_COLOR[backColor],
          LOADER_SIZE_STYLE[size]
        )}
      ></div>
      <div
        className={clsx(
          "lds-ring-front",
          FONT_COLOR[frontColor],
          LOADER_SIZE_STYLE[size]
        )}
      ></div>
    </div>
  );
}

const LOADER_SIZE_STYLE: Record<LoaderSize, string> = {
  md: "w-8 h-8 border-[6px]",
  sm: "w-4 h-4 border-[4px]",
};
