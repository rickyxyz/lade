import { Button, Dropdown, Icon } from "@/components";
import { DropdownOptionType } from "@/types";
import { BsThreeDotsVertical } from "react-icons/bs";

interface MoreProps {
  options: DropdownOptionType[];
}

export function More({ options }: MoreProps) {
  return (
    <Dropdown
      optionWidth={100}
      direction="left"
      options={options}
      triggerElement={
        <Button className="!w-8 !h-8" variant="ghost">
          <Icon size="s" IconComponent={BsThreeDotsVertical} />
        </Button>
      }
    />
  );
}
