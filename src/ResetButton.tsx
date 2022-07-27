import React from "react";
import { Button } from "@nfort/holism-ui";
import { useFormikContext } from "formik";
import { IProps } from "@nfort/holism-ui/dist/Button/interfaces";

export const RESET_BUTTON_ID = "holism-reset-button";

type RequiredProps = "dimension" | "type" | "color" | "children";
type PartialProps = Partial<Pick<IProps, RequiredProps>>;
export function ResetButton({
  dimension = "medium",
  type = "reset",
  color = "secondary",
  onClick,
  children = "Очистить",
  ...restProps
}: PartialProps & Omit<IProps, RequiredProps>) {
  const formContext = useFormikContext();
  return (
    <Button
      id={RESET_BUTTON_ID}
      dimension={dimension}
      type={type}
      color={color}
      onClick={(event) => {
        formContext.resetForm();
        onClick && onClick(event);
      }}
      {...restProps}
    >
      {children}
    </Button>
  );
}
