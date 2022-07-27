import { Field, FieldAttributes, FieldProps } from "formik";
import { TextArea as HolismTextarea } from "@nfort/holism-ui";
import React from "react";
import { IProps } from "@nfort/holism-ui/dist/TextArea/interfaces";

type RequiredProps = "theme";
export function Textarea({
  name,
  validate,
  dimension = "medium",
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
