/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, useFormikContext } from "formik";
import { Select, SelectProps } from "@/components";
import { SelectOptionType } from "@/types";
import { Setting } from "./Setting";

interface SettingSelectProps<X extends string, Y extends SelectOptionType<X>[]>
  extends SelectProps<X, Y> {
  formName: string;
  name: string;
}

export function SettingSelect<
  X extends string,
  Y extends SelectOptionType<X>[]
>({
  formName,
  name,
  onBlur,
  onSelectOption,
  selectedOption,
  allowClearSelection,
  ...rest
}: SettingSelectProps<X, Y>) {
  const { setFieldTouched } = useFormikContext<any>();

  return (
    <Setting formName={formName} name={name}>
      <>
        <Select
          className="col-span-2"
          onBlur={() => {
            onBlur && onBlur();
            setFieldTouched(formName, true);
          }}
          optional
          allowClearSelection={false}
          onSelectOption={onSelectOption}
          selectedOption={selectedOption}
          {...rest}
        />
        <Field name={formName}>
          {({ field, meta }: any) => (
            <>
              <input {...rest} {...field} className="hidden" type="text" />
              {meta.touched && meta.error && (
                <span className="pl-4 col-start-2 text-danger-500">
                  {meta.error}
                </span>
              )}
            </>
          )}
        </Field>
      </>
    </Setting>
  );
}
