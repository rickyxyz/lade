import { Button, Dropdown, Icon } from "@/components";
import { DropdownOptionType } from "@/types";

interface ProblemMoreProps {
  options: DropdownOptionType[];
}

export function ProblemMore({ options }: ProblemMoreProps) {
  return (
    <Dropdown
      optionWidth={100}
      direction="left"
      options={options}
      triggerElement={
        <Button className="!w-8 !h-8" variant="ghost">
          <Icon size="sm" icon="threeDots" />
        </Button>
      }
    />
  );
}
