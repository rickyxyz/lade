import { Paragraph, Select, SelectProps } from "@/components";
import { SelectOptionType } from "@/types";

interface ProblemFilterSingleProps<
  X extends string,
  Y extends SelectOptionType<X>[]
> extends SelectProps<X, Y> {
  title: string;
  loading: boolean;
}

export function ProblemFilterSingle<
  X extends string,
  Y extends SelectOptionType<X>[]
>({ title, loading, ...props }: ProblemFilterSingleProps<X, Y>) {
  return (
    <div className="flex-1">
      <Paragraph>{title}</Paragraph>
      <Select
        {...props}
        className="w-full"
        inputClassName="w-full"
        unselectedText="Any"
        optional
        loading={loading}
      />
    </div>
  );
}
