import { CheckBox as HolismCheckBox } from "@holism/components";
import { Field, FieldAttributes, FieldProps } from "formik";
import { IProps } from "@holism/components/types/new-components/CheckBox/interfaces";
import React from "react";

type RequiredProps = "dimension" | "onChange" | "isChecked";
type PartialProps = Partial<Pick<IProps, RequiredProps>>;
export function Checkbox({
  name,
  onChange,
  dimension = "medium",
  ...restProps
}: PartialProps & Omit<IProps, RequiredProps> & { name: string } & Partial<Pick<FieldAttributes<any>, "validate">>) {
  return (
    <Field name={name}>
      {({ meta, field, form }: FieldProps) => (
        <HolismCheckBox
          isChecked={field.value}
          dimension={dimension}
          onChange={(event, isChecked, id) => {
            form.setFieldValue(name, isChecked);
            form.setFieldTouched(name, true, false);
            onChange && onChange(event, isChecked, id);
          }}
          isError={meta.touched && !!meta.error}
          {...restProps}
        />
      )}
    </Field>
  );
}
