import React from "react";
import { Formik, Form, useFormikContext } from "formik";
import { object, string, boolean } from "yup";
import { Input } from "../src/Input";
import { InputSuggest } from "../src/InputSuggest";
import { SubmitButton } from "../src/SubmitButton";
import { ResetButton } from "../src/ResetButton";
import { Checkbox } from "../src/Checkbox";
import { Select } from "../src/Select";
import { DefaultTheme, ThemeProvider } from "@holism/components";
import { Textarea } from "./Textarea";

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
  date: string().required(),
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
          date: "2022-02-08",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, formikHelpers) => {
          alert(JSON.stringify(values, null, 2));
          formikHelpers.setSubmitting(false);
        }}
      >
        <Form>
          <Input name="firstName" placeholder="Имя" />
          <Checkbox name="isAgree" label="Согласен с правилами" />
          <Select
            name="country"
            placeholder="Страна"
            withoutOptionMessage="Ничего не найден"
            options={[
              { label: "Россия", value: "russia" },
              { label: "США", value: "usa" },
            ]}
          />
          <Input name="date" type="date" min="2022-02-06" max="2022-02-12" />
          <InputSuggest name="address" placeholder="Адрес" onSuggestionsFetchRequested={fetchSuggestion} />
          <Textarea name="comment" placeholder="Коммент" />
          <SubmitButton>Отправить</SubmitButton>
          <ResetButton />
          <FormikDebug />
        </Form>
      </Formik>
    </ThemeProvider>
  );
}
