import React, { useState } from "react";
import { InputSuggest as HolismInputSuggest } from "@holism/components";
import { Field, FieldAttributes, FieldProps } from "formik";
import { IProps, IPropsItem } from "@holism/components/types/new-components/InputSuggest/interfaces";
import { RESET_BUTTON_ID } from "./ResetButton";
import { SUBMIT_BUTTON_ID } from "./SubmitButton";

type RequieredProps = "value" | "dimension" | "options" | "onSuggestionsFetchRequested";
type PartialProps = Omit<Partial<Pick<IProps, RequieredProps>>, "onSuggestionsFetchRequested">;
export function InputSuggest({
  dimension = "small",
  name,
  onSuggestionsFetchRequested,
  onChange,
  validate,
  ...restProps
}: PartialProps &
  Omit<IProps, RequieredProps> &
  Partial<Pick<FieldAttributes<any>, "validate" | "name">> & {
    onSuggestionsFetchRequested: (value: string) => Promise<IPropsItem[]>;
  }) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<IPropsItem[]>([]);
  return (
    <Field name={name} validate={validate}>
      {({ form, meta, field }: FieldProps) => {
        const _onSuggestionsFetchRequested = (value: string) => {
          if (!value) {
            return;
          }
          setIsLoading(true);
          onSuggestionsFetchRequested(value)
            .then(setOptions)
            .finally(() => setIsLoading(false));
        };
        return (
          <HolismInputSuggest
            dimension={dimension}
            name={field.name}
            isLoading={isLoading}
            noOptionsMessage="Не данных"
            onSuggestionsFetchRequested={_onSuggestionsFetchRequested}
            value={field.value}
            onChange={(value) => {
              form.setFieldValue(field.name, value);
              form.setFieldTouched(field.name, true, false);
              onChange && onChange(value);
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
              form.handleBlur(field.name)(event);
            }}
            options={options}
            isError={meta.touched && !!meta.error}
            errorMessage={meta.touched ? meta.error : undefined}
            {...restProps}
          />
        );
      }}
    </Field>
  );
}
