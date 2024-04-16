import clsx from "clsx";
import { useDevice } from "@/hooks";
import { ButtonOrderType } from "@/types";
import { Button } from "./Button";

export interface ButtonListEntry {
  label: string;
  handler: () => void;
}

interface ButtonListProps {
  list: ButtonListEntry[];
  className?: string;
}

export function ButtonList({ list, className }: ButtonListProps) {
  const { device } = useDevice();
  return (
    <ul className={className}>
      {list.map(({ label, handler }, idx) => {
        let order: ButtonOrderType | undefined = "middle";
        if (idx === 0) order = "first";
        if (idx === list.length - 1) order = "last";
        if (list.length === 1) order = undefined;

        return (
          <li key={label}>
            <Button
              className={clsx("!w-full", device !== "mobile" && "!pl-8")}
              textClassName={clsx(device === "mobile" && "text-lg-alt")}
              variant="outline"
              alignText={device === "mobile" ? "center" : "left"}
              order={order}
              orderDirection="column"
              onClick={handler}
              label={label}
            />
          </li>
        );
      })}
    </ul>
  );
}
