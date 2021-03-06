import * as React from "react";
import { Formik, Form, useFormikContext } from "formik";
import { object, string, boolean, date } from "yup";
import { Input } from "../src/Input";
import { InputSuggest } from "../src/InputSuggest";
import { SubmitButton } from "../src/SubmitButton";
import { ResetButton } from "../src/ResetButton";
import { Checkbox } from "../src/Checkbox";
import { Select } from "../src/Select";
import { DefaultTheme, ThemeProvider } from "@nfort/holism-ui";
import { Textarea } from "../src/Textarea";
import styled from "styled-components";

function fetchSuggestion(): Promise<any> {
  console.log("fired");
  return new Promise((resolve) => {
    setTimeout(
      () => resolve([{ label: "Москва, ул Пушкина, Дом Колотушкина", value: "Москва, ул Пушкина, Дом Колотушкина" }]),
      2000
    );
  });
}

function checkAvailableAddress(address: string | null | undefined): Promise<boolean> {
  return new Promise(function (resolve) {
    setTimeout(() => {
      if (address === "Москва, ул Пушкина, Дом Колотушкина") {
        return resolve(true);
      }
      return resolve(false);
    }, 3000);
  });
}

function FormikDebug() {
  const { values, touched, errors } = useFormikContext();
  return <pre>{JSON.stringify({ values, touched, errors }, null, 2)}</pre>;
}

const validationSchema = object({
  firstName: string().required(),
  address: string().required().test("is-available-delivery", "Адрес не доступен для доставки", checkAvailableAddress),
  isAgree: boolean().required().notOneOf([false], " "),
  country: string().required(),
  date: date().required(),
  dateStart: date().min(new Date("2022-08-31")).required(),
  comment: string().required(),
});

export function KitchenSink() {
  return (
    <ThemeProvider theme={DefaultTheme}>
      <Formik
        initialValues={{
          firstName: "",
          address: "",
          comment: "",
          isAgree: false,
          country: "russia",
          date: new Date("2022-08-01"),
          dateStart: new Date("2022-08-01"),
        }}
        validationSchema={validationSchema}
        onSubmit={(values, formikHelpers) => {
          alert(JSON.stringify(values, null, 2));
          formikHelpers.setSubmitting(false);
        }}
      >
        <Form>
          <Field>
            <Input name="firstName" placeholder="Имя" />
          </Field>
          <Field>
            <Checkbox name="isAgree" label="Согласен с правилами" />
          </Field>
          <Field>
            <Select
              name="country"
              placeholder="Страна"
              withoutOptionMessage="Ничего не найден"
              options={[
                { label: "Россия", value: "russia" },
                { label: "США", value: "usa" },
              ]}
            />
          </Field>
          <Field>
            <Select
              name="dateStart"
              placeholder="Дата начало работы"
              withoutOptionMessage="Ничего не найден"
              options={[
                { label: "2022-07-31", value: new Date("2022-07-31") },
                { label: "2022-08-01", value: new Date("2022-08-01") },
                { label: "2022-08-02", value: new Date("2022-08-02") },
              ]}
            />
          </Field>
          <Field>
            <Input name="date" type="date" placeholder="Дата" min="2022-08-01" max="2022-08-28" />
          </Field>
          <Field>
            <InputSuggest name="address" placeholder="Адрес" onSuggestionsFetchRequested={fetchSuggestion} />
          </Field>
          <Field>
            <Textarea name="comment" minRows={5} placeholder="Коммент" />
          </Field>
          <Field>
            <SubmitButton>Отправить</SubmitButton>
          </Field>
          <Field>
            <ResetButton />
          </Field>
          <FormikDebug />
        </Form>
      </Formik>
    </ThemeProvider>
  );
}

const Field = styled.div`
  margin-bottom: 1rem;
`;
