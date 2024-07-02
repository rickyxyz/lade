/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field } from "formik";
import { HTMLInputTypeAttribute } from "react";
import { Input, InputProps } from "@/components";

interface AuthInputProps extends InputProps {
  name: string;
  type: HTMLInputTypeAttribute;
  loading?: boolean;
}

export function AuthInput({ loading, ...props }: AuthInputProps) {
  const { name } = props;

  return (
    <Field name={name}>
      {({ field, form: { touched, errors } }: any) => (
        <Input
          {...props}
          {...field}
          id={name}
          externalWrapperClassName="mb-4"
          wrapperClassName="w-64"
          errorText={touched[name] ? errors[name] : undefined}
        />
      )}
    </Field>
  );
}
