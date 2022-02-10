import { Field, FieldAttributes, FieldProps } from "formik";
import { Textarea as HolismTextarea } from "@holism/components";
import { IProps } from "@holism/components/types/new-components/TextArea/interfaces";
import React from "react";

type RequiredProps = "theme";
export function Textarea({
  name,
  validate,
  dimension = "small",
  ...restProps
}: Omit<IProps, RequiredProps> & Partial<Pick<FieldAttributes<any>, "validate">>) {
  return (
    <Field name={name} validate={validate}>
      {({ meta, field }: FieldProps) => {
        return <HolismTextarea {...field} {...restProps} error={meta.touched && meta.error} dimension={dimension} />;
      }}
    </Field>
  );
}
