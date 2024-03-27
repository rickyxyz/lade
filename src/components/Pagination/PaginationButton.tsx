import clsx from "clsx";
import { Button } from "../Button";

interface PaginationButtonProps {
  page: number;
  isActive: boolean;
  size?: "m" | "s";
  onClick: () => void;
}

export function PaginationButton({
  page,
  isActive,
  size = "m",
  onClick,
}: PaginationButtonProps) {
  return (
    <Button
      className={clsx(size === "m" ? "w-10" : "!w-8 !h-8 !px-0")}
      variant={isActive ? "solid" : "outline"}
      order="middle"
      orderDirection="row"
      label={String(page)}
      onClick={onClick}
    />
  );
}
