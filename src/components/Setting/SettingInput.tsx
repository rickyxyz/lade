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
  return (
    <Field name={formName}>
      {({ field, meta }: any) => (
        <div className="col-span-2">
          <Input
            {...field}
            type="text"
            id={formName}
            label={name}
            name={formName}
            disabled={disabled}
            errorText={meta.touched && meta.error}
            {...rest}
          />
        </div>
      )}
    </Field>
  );
}
