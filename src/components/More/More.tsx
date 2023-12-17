import { Button, Dropdown, Icon } from "@/components";
import { DropdownOptionType } from "@/types";
import clsx from "clsx";
import { BsThreeDotsVertical } from "react-icons/bs";

interface MoreProps {
  className?: string;
  options: DropdownOptionType[];
}

export function More({ className, options }: MoreProps) {
  return (
    <Dropdown
      optionWidth={100}
      direction="left"
      options={options}
      triggerElement={
        <Button className={clsx("!w-8 !h-8", className)} variant="ghost">
          <Icon size="s" IconComponent={BsThreeDotsVertical} />
        </Button>
      }
    />
  );
}
