import React, { useCallback, useState } from "react";
import { InputSuggest as HolismInputSuggest } from "@nfort/holism-ui";
import { Field, FieldAttributes, FieldProps } from "formik";
import { RESET_BUTTON_ID } from "./ResetButton";
import { SUBMIT_BUTTON_ID } from "./SubmitButton";
import debounce from "lodash.debounce";
/* @ts-ignore-next-line */
import Autosuggest from "@nfort/react-autosuggest";
/* @ts-ignore-next-line */
import { GetSuggestionValue, RenderSuggestion } from "@types/react-autosuggest";
import { IProps, IPropsItem } from "@nfort/holism-ui/dist/InputSuggest/interfaces";

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const defaultGetSuggestionValue = (suggestion: any) => suggestion.value;

// Use your imagination to render suggestions.
const defaultRenderSuggestion = (suggestion: any) => (
  <HolismInputSuggest.InputSuggestOption value={suggestion.value} label={suggestion.label} />
);

type RequieredProps = "value" | "dimension" | "options";
type PartialProps = Partial<Pick<IProps, RequieredProps>>;
export function InputSuggest({
  dimension = "medium",
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
        /* @ts-ignore-next-line */
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
          <HolismInputSuggest.SuggestContainer
            dimension={dimension}
            isError={meta.touched && !!meta.error}
            isDisabled={restProps.isDisabled}
            width={undefined}
            hasValue={!!field.value}
            className={restProps.className}
          >
            <HolismInputSuggest.InputContainer>
              {label && dimension === "small" && (
                <HolismInputSuggest.LabelStyle
                  data-element="inputSuggest-label"
                  htmlFor={name}
                  hasValue={!!field.value}
                  isError={meta.touched && !!meta.error}
                >
                  {label}
                </HolismInputSuggest.LabelStyle>
              )}
              <Autosuggest
                suggestions={suggestions}
                alwaysRenderSuggestions={alwaysRenderSuggestions}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                  name,
                  value: field.value,

                  /* @ts-ignore-next-line */
                  onFocus: (event) => {
                    setFocusedFlag(true);
                    onFocus && onFocus(event, field.value);
                  },
                  /* @ts-ignore-next-line */
                  onChange: (event, { newValue }) => {
                    form.setFieldValue(field.name, newValue);
                    form.setFieldTouched(field.name, true, false);
                    /* @ts-ignore-next-line */
                    onChange && onChange(event, newValue);
                  },
                  /* @ts-ignore-next-line */
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
                    <HolismInputSuggest.SuggestInputField
                      styledProps={{
                        dimension,
                        isDisabled: !!restProps.isDisabled,
                        isSuggestionsListOpened: false,
                        isError: meta.touched && !!meta.error,
                        /* @ts-ignore-next-line */
                        isFocus: isFocused,
                        hasValue: !!field.value,
                        value: field.value || "",
                      }}
                      dimension={dimension}
                      isFocus={isFocused}
                      placeholder={placeholder || ""}
                      onClear={() => {
                        form.setFieldValue(field.name, "");
                      }}
                      inputProps={{
                        ...others,
                        ref: innerRef,
                      }}
                    />
                  );
                }}
              />
            </HolismInputSuggest.InputContainer>
            {isLoading && !suggestions.length && <HolismInputSuggest.LoadingIndicator />}
            {isFocused && !isLoading && !suggestions.length && noOptionsMessage && (
              <HolismInputSuggest.NoOptionStyle
                data-element="inputSuggest-noOption"
                isError={meta.touched && !!meta.error}
                dimension={dimension}
              >
                {noOptionsMessage}
              </HolismInputSuggest.NoOptionStyle>
            )}
            {meta.touched && meta.error && (
              <HolismInputSuggest.ErrorMessageStyle data-element="inputSuggest-error">
                {meta.error}
              </HolismInputSuggest.ErrorMessageStyle>
            )}
          </HolismInputSuggest.SuggestContainer>
        );
      }}
    </Field>
  );
}
