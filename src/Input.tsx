import React, { useRef, useEffect } from "react";
import { FieldProps, Field, FieldAttributes } from "formik";
import { Input as HolismInput } from "@nfort/holism-ui";
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
  dimension = "medium",
  tooltipPosition = "top",
  validate,
  ...restProps
}: Omit<IProps, RequiredProps> &
  PartialProps &
  Partial<Pick<FieldAttributes<any>, "validate">> &
  Partial<Pick<HTMLInputElement, "min" | "max">>) => {
  let refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (refInput.current) {
      if (type === "date") {
        const { max = "", min = "" } = restProps;
        if (min) {
          refInput.current.setAttribute("min", min);
        }
        if (max) {
          refInput.current.setAttribute("max", max);
        }
      }
    }
  });

  return (
    <Field name={name} validate={validate}>
      {({ meta, field }: FieldProps) => {
        return (
          <HolismInput
            //@ts-ignore
            getRefProp={(ref) => (refInput = ref)}
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
