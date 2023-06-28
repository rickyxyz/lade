/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, useFormikContext } from "formik";
import { Select, SelectProps } from "@/components";
import { SelectOptionType } from "@/types";
import { ContentSetting } from "./ContentSetting";

interface ContentSettingSelectProps<
  X extends string,
  Y extends SelectOptionType<X>[]
> extends SelectProps<X, Y> {
  formName: string;
  name: string;
}

export function ContentSettingSelect<
  X extends string,
  Y extends SelectOptionType<X>[]
>({ formName, name, onBlur, ...rest }: ContentSettingSelectProps<X, Y>) {
  const { setFieldTouched } = useFormikContext<any>();

  return (
    <ContentSetting formName={formName} name={name}>
      <>
        <Select
          className="col-span-2"
          onBlur={() => {
            onBlur && onBlur();
            setFieldTouched(formName, true);
          }}
          optional
          allowClearSelection={false}
          {...rest}
        />
        <Field name={formName}>
          {({ field, meta }: any) => (
            <>
              <input {...rest} {...field} className="hidden" type="text" />
              {meta.touched && meta.error && (
                <span className="pl-4 col-start-2 text-red-500">
                  {meta.error}
                </span>
              )}
            </>
          )}
        </Field>
      </>
    </ContentSetting>
  );
}
