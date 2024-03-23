import { Button, Dropdown, Icon } from "@/components";
import { DropdownOptionType } from "@/types";
import clsx from "clsx";
import { ButtonIcon } from "../Button/ButtonIcon";
import { MoreVertOutlined } from "@mui/icons-material";

interface MoreProps {
  className?: string;
  options: DropdownOptionType[];
}

export function More({ className, options }: MoreProps) {
  return (
    <Dropdown
      className={className}
      optionWidth={100}
      direction="left"
      options={options}
      triggerElement={
        // <Button
        //   className={clsx("!w-8 !h-8", className)}
        //   variant="ghost"
        //   icon={BsThreeDotsVertical}
        // />
        <ButtonIcon variant="ghost" icon={MoreVertOutlined} />
      }
    />
  );
}
