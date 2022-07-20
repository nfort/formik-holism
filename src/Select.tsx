import { Select as HolismSelect } from "@nfort/holism-ui";
import { Field, FieldAttributes, FieldProps } from "formik";
import React, { ComponentProps } from "react";
import { RESET_BUTTON_ID } from "./ResetButton";
import { SUBMIT_BUTTON_ID } from "./SubmitButton";

type BaseComponentProps = ComponentProps<typeof HolismSelect>;
type RequiredProps = "dimension";
type PartialProps = Partial<Pick<BaseComponentProps, RequiredProps>>;
export function Select({
  dimension = "medium",
  name,
  options,
  validate,
  onChange,
  onBlur,
  withoutOptionMessage = "Ничего не найдено",
  ...restProps
}: PartialProps & Omit<BaseComponentProps, RequiredProps> & Partial<Pick<FieldAttributes<any>, "validate">>) {
  return (
    <Field name={name} validate={validate}>
      {({ field, form, meta }: FieldProps) => {
        const computedProps: Pick<BaseComponentProps, "value" | "defaultValue"> = {};
        const value = options.find((option) => {
          if (option.value instanceof Date) {
            if (field.value instanceof Date) {
              return field.value.getTime() === option.value.getTime();
            }
            throw new Error("Select: field.value не является Date");
          }
          return option.value === field.value;
        });
        if (value) {
          computedProps.value = [value];
        }
        return (
          <HolismSelect
            {...computedProps}
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
              /*
                  При новом рендере контрола holism'a возвращается новый id в аттрибутах инпута, которые берется при вызове onBlur

                  в touched будут следующие записи
                  {
                    react-select-1-input: true,
                    react-select-2-input: true,
                    react-select-3-input: true,
                    react-select-[NUMBER]-input: true,
                  }

                  Поэтому передаем name
               */
              field.onBlur(name);
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
