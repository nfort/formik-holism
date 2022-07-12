import React from "react";
import { Button } from "@holism/components";
import { IProps } from "@holism/components/types/new-components/Button/interfaces";
import { useFormikContext } from "formik";

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
