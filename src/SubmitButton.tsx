import React from "react";
import { Button } from "@nfort/holism-ui";
import { useFormikContext } from "formik";
import { IProps } from "@nfort/holism-ui/dist/Button/interfaces";

export const SUBMIT_BUTTON_ID = "holism-submit-button";

type RequiredProps = "dimension" | "type" | "color";
type PartialProps = Partial<Pick<IProps, RequiredProps>>;
export function SubmitButton({
  dimension = "medium",
  type = "submit",
  color = "primary",
  children,
  ...restProps
}: PartialProps & Omit<IProps, RequiredProps>) {
  const formContext = useFormikContext();
  return (
    <Button
      id={SUBMIT_BUTTON_ID}
      dimension={dimension}
      type={type}
      color={color}
      isLoading={formContext.isSubmitting}
      {...restProps}
    >
      {children}
    </Button>
  );
}
