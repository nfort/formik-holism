import React from "react";
import { FieldProps, Field, FieldAttributes } from "formik";
import { Input as HolismInput } from "@holism/components";
import { IProps } from "@holism/components/types/new-components/Input/interfaces";
import { SUBMIT_BUTTON_ID } from "./SubmitButton";
import { RESET_BUTTON_ID } from "./ResetButton";

type RequiredProps = "type" | "alignText" | "dimension" | "tooltipPosition" | "onChange";
type PartialProps = Partial<Pick<IProps, RequiredProps>>;
export const Input = ({
  name,
  type = "text",
  alignText = "left",
  onChange,
  onBlur,
  dimension = "small",
  tooltipPosition = "top",
  validate,
  ...restProps
}: Omit<IProps, RequiredProps> & PartialProps & Partial<Pick<FieldAttributes<any>, "validate">>) => {
  return (
    <Field name={name} validate={validate}>
      {({ meta, field }: FieldProps) => {
        return (
          <HolismInput
            name={field.name}
            type={type}
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
            }}
            onChange={field.onChange}
            alignText={alignText}
            dimension={dimension}
            value={field.value}
            error={meta.touched && meta.error}
            tooltipPosition={tooltipPosition}
            {...restProps}
          />
        );
      }}
    </Field>
  );
};
