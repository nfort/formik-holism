import { Select as HolismSelect } from "@holism/components";
import { Field, FieldAttributes, FieldProps } from "formik";
import React from "react";
import { IItem, ISelect } from "@holism/components/types/new-components/Select/interfaces";
import { RESET_BUTTON_ID } from "./ResetButton";
import { SUBMIT_BUTTON_ID } from "./SubmitButton";

type RequiredProps = "dimension";
type PartialProps = Partial<Pick<ISelect, RequiredProps>>;
export function Select({
  dimension = "small",
  name,
  options,
  validate,
  onChange,
  onBlur,
  withoutOptionMessage = "Ничего не найдено",
  ...restProps
}: PartialProps & Omit<ISelect, RequiredProps> & Partial<Pick<FieldAttributes<any>, "validate">>) {
  return (
    <Field name={name} validate={validate}>
      {({ field, form, meta }: FieldProps) => {
        const value = options.find((option) => option.value === field.value) as IItem;
        return (
          <HolismSelect
            value={[value]}
            onChange={(selectedItem) => {
              form.setFieldValue(field.name, selectedItem ? selectedItem.value : "");
              form.setFieldTouched(field.name, true, false);
              onChange && onChange(selectedItem);
            }}
            onBlur={(event) => {
              if (event.relatedTarget instanceof Element) {
                /*
                  Skip validation onBlur when reset / submit button is clicked or
                  It will block reset / submit button onClick event
                */
                if (event.relatedTarget.id === RESET_BUTTON_ID || event.relatedTarget.id === SUBMIT_BUTTON_ID) {
                  return;
                }
              }
              field.onBlur(event);
              onBlur && onBlur(event);
            }}
            dimension={dimension}
            options={options}
            withoutOptionMessage={withoutOptionMessage}
            isError={meta.touched && !!meta.error}
            errorMessage={meta.touched ? meta.error : undefined}
            {...restProps}
          />
        );
      }}
    </Field>
  );
}
