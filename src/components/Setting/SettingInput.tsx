/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, useFormikContext } from "formik";
import { Input, Select, SelectProps } from "@/components";
import { SelectOptionType } from "@/types";
import { Setting } from "./Setting";
import { HTMLProps } from "react";

interface SettingInputProps extends HTMLProps<HTMLDivElement> {
  formName: string;
}

export function SettingInput({
  formName,
  name,
  disabled,
  ...rest
}: SettingInputProps) {
  const { setFieldTouched } = useFormikContext<any>();

  return (
    <Setting name={name}>
      {/* <Field name={formName}>
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
        </Field> */}
      <Field name={formName}>
        {({ field, meta }: any) => (
          <div className="col-span-2">
            <Input
              {...field}
              type="text"
              name={formName}
              disabled={disabled}
              errorText={meta.touched && meta.error}
              {...rest}
            />
          </div>
        )}
      </Field>
    </Setting>
  );
}
