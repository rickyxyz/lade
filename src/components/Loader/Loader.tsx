import clsx from "clsx";
import { FONT_COLOR, FontColor } from "@/consts/style";
import { Spinner } from "../Spinner";

interface LoaderProps {
  caption?: string;
  height?: number;
}

export function Loader({ caption }: LoaderProps) {

  return (
    <div className="flex flex-col items-center justify-center h-64 text-primary-700">
      <Spinner />
      <span className="mt-2 text-primary-700">{caption}</span>
    </div>
  );
}
