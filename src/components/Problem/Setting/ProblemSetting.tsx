import { Select, SelectProps } from "@/components";
import { SelectOptionType } from "@/types";

interface ProblemSettingProps<X extends string, Y extends SelectOptionType<X>[]>
  extends SelectProps<X, Y> {
  name: string;
}

export function ProblemSettingSelect<
  X extends string,
  Y extends SelectOptionType<X>[]
>({ name, ...rest }: ProblemSettingProps<X, Y>) {
  return (
    <div className="flex gap-4 items-center">
      <span className="w-40">{name}</span>
      <Select className="w-80" {...rest} />
    </div>
  );
}
