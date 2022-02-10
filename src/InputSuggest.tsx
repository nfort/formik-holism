// @ts-nocheck

import React, { useCallback, useState } from "react";
import { InputSuggestOption } from "@holism/components";
import { Field, FieldAttributes, FieldProps } from "formik";
import {
  SuggestContainer,
  InputContainer,
  LabelStyle,
  ErrorMessageStyle,
  NoOptionStyle,
} from "@holism/components/esm/new-components/InputSuggest/style";
import SuggestInputField from "@holism/components/esm/new-components/InputSuggest/components/Input";
import LoadingIndicator from "@holism/components/esm/new-components/InputSuggest/components/LoadingIndicator";
import { RESET_BUTTON_ID } from "./ResetButton";
import { SUBMIT_BUTTON_ID } from "./SubmitButton";
import debounce from "lodash.debounce";
import Autosuggest from "@nfort/react-autosuggest";
import { GetSuggestionValue, RenderSuggestion } from "@types/react-autosuggest";
import { IPropsItem, IProps } from "@holism/components/types/new-components/InputSuggest/interfaces";

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const defaultGetSuggestionValue = (suggestion) => suggestion.value;

// Use your imagination to render suggestions.
const defaultRenderSuggestion = (suggestion) => (
  <InputSuggestOption value={suggestion.value} label={suggestion.label} />
);

type RequieredProps = "value" | "dimension" | "options";
type PartialProps = Partial<Pick<IProps, RequieredProps>>;
export function InputSuggest({
  dimension = "small",
  name,
  onSuggestionsFetchRequested,
  getSuggestionValue = defaultGetSuggestionValue,
  renderSuggestion = defaultRenderSuggestion,
  alwaysRenderSuggestions = false,
  debounceTime = 1000,
  onFocus,
  onChange,
  onBlur,
  validate,
  placeholder,
  label,
  noOptionsMessage,
  ...restProps
}: PartialProps &
  Omit<IProps, RequieredProps> &
  Partial<Pick<FieldAttributes<any>, "validate">> &
  Pick<FieldAttributes<any>, "name"> & {
    onSuggestionsFetchRequested: (value: string) => Promise<IPropsItem[]>;
    renderSuggestion?: RenderSuggestion<IPropsItem>;
    getSuggestionValue?: GetSuggestionValue<IPropsItem>;
    debounceTime?: number;
    alwaysRenderSuggestions?: boolean;
  }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setFocusedFlag] = useState(false);
  const [suggestions, setSuggestions] = useState<IPropsItem[]>([]);
  const _onSuggestionsFetchRequested = useCallback(
    debounce(({ value }) => {
      if (!value) {
        return;
      }
      setIsLoading(true);
      onSuggestionsFetchRequested(value)
        .then(setSuggestions)
        .finally(() => setIsLoading(false));
    }, debounceTime),
    []
  );
  const _onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };
  return (
    <Field name={name} validate={validate}>
      {({ form, meta, field }: FieldProps) => {
        return (
          <SuggestContainer
            dimension={dimension}
            isError={meta.touched && !!meta.error}
            isDisabled={restProps.isDisabled}
            width={undefined}
            hasValue={!!field.value}
            className={restProps.className}
          >
            <InputContainer>
              {label && dimension === "small" && (
                <LabelStyle
                  data-element="inputSuggest-label"
                  htmlFor={name}
                  hasValue={!!field.value}
                  isError={meta.touched && !!meta.error}
                >
                  {label}
                </LabelStyle>
              )}
              <Autosuggest
                suggestions={suggestions}
                alwaysRenderSuggestions={alwaysRenderSuggestions}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                  name,
                  value: field.value,
                  onFocus: (event) => {
                    setFocusedFlag(true);
                    onFocus && onFocus(event, field.value);
                  },
                  onChange: (event, { newValue }) => {
                    form.setFieldValue(field.name, newValue);
                    form.setFieldTouched(field.name, true, false);
                    onChange && onChange(event, newValue);
                  },
                  onBlur: (event) => {
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
                    setFocusedFlag(false);
                    onBlur && onBlur(event, field.value);
                  },
                  dimension,
                }}
                onSuggestionsFetchRequested={_onSuggestionsFetchRequested}
                onSuggestionsClearRequested={_onSuggestionsClearRequested}
                highlightFirstSuggestion={true}
                renderInputComponent={(inputProps: any) => {
                  const { innerRef, ...others } = inputProps;
                  return (
                    <SuggestInputField
                      styledProps={{
                        dimension,
                        isDisabled: restProps.isDisabled,
                        isSuggestionsListOpened: false,
                        isError: meta.touched && !!meta.error,
                        isFocus: isFocused,
                        hasValue: !!field.value,
                        value: field.value || "",
                      }}
                      dimension={dimension}
                      isFocus={isFocused}
                      placeholder={placeholder}
                      inputProps={{
                        ...others,
                        ref: innerRef,
                      }}
                    />
                  );
                }}
              />
            </InputContainer>
            {isLoading && !suggestions.length && <LoadingIndicator />}
            {isFocused && !isLoading && !suggestions.length && noOptionsMessage && (
              <NoOptionStyle
                data-element="inputSuggest-noOption"
                isError={meta.touched && !!meta.error}
                dimension={dimension}
              >
                {noOptionsMessage}
              </NoOptionStyle>
            )}
            {meta.touched && meta.error && (
              <ErrorMessageStyle data-element="inputSuggest-error">{meta.error}</ErrorMessageStyle>
            )}
          </SuggestContainer>
        );
      }}
    </Field>
  );
}
