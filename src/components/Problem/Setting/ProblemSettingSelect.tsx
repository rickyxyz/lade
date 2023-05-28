/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field } from "formik";
import { Select, SelectProps } from "@/components";
import { SelectOptionType } from "@/types";

interface ProblemSettingSelectProps<
  X extends string,
  Y extends SelectOptionType<X>[]
> extends SelectProps<X, Y> {
  formName: string;
  name: string;
}

export function ProblemSettingSelect<
  X extends string,
  Y extends SelectOptionType<X>[]
>({ formName, name, ...rest }: ProblemSettingSelectProps<X, Y>) {
  return (
    <div className="grid grid-cols-3 gap-2 items-center">
      <span className="w-40">{name}</span>
      <Select className="col-span-2" {...rest} />
      <Field name={formName}>
        {({ field, meta }: any) => (
          <>
            <input className="hidden" type="text" {...field} />
            {meta.touched && meta.error && (
              <span className="pl-4 col-start-2 text-red-500">
                {meta.error}
              </span>
            )}
          </>
        )}
      </Field>
    </div>
  );
}
