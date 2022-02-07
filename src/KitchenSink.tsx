import React from "react";
import { Formik, Form, useFormikContext } from "formik";
import { object, string, boolean } from "yup";
import { Input } from "../src/Input";
import { InputSuggest } from "../src/InputSuggest";
import { SubmitButton } from "../src/SubmitButton";
import { ResetButton } from "../src/ResetButton";
import { Checkbox } from "../src/Checkbox";
import { Select } from "../src/Select";

function fetchSuggestion(address: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([{ label: "Москва, ул Пушкина, Дом Колотушкина", value: address }]), 2000);
  });
}

function checkAvailableAddress(address: string | null | undefined): Promise<boolean> {
  return new Promise(function (resolve) {
    setTimeout(() => {
      if (address === "Москва, ул Пушкина, Дом Колотушкина") {
        return resolve(true);
      }
      return resolve(false);
    }, 2000);
  });
}

function FormikDebug() {
  const { values, touched, errors } = useFormikContext();
  return <pre>{JSON.stringify({ values, touched, errors }, null, 2)}</pre>;
}

const validatationSchema = object({
  firstName: string().required(),
  address: string().required().test("is-available-delivery", "Адрес не доступен для доставки", checkAvailableAddress),
  isAgree: boolean().required().notOneOf([false], " "),
  country: string().required(),
});

export function KitchenSink() {
  return (
    <Formik
      initialValues={{ firstName: "", address: "", isAgree: false, country: "russia" }}
      validationSchema={validatationSchema}
      onSubmit={(values, formikHelpers) => {
        alert(JSON.stringify(values, null, 2));
        formikHelpers.setSubmitting(false);
      }}
    >
      <Form>
        <Input name="firstName" placeholder="Имя" />
        <InputSuggest name="address" onSuggestionsFetchRequested={fetchSuggestion} />
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
        <SubmitButton>Отправить</SubmitButton>
        <ResetButton>Сбросить</ResetButton>
        <FormikDebug />
      </Form>
    </Formik>
  );
}
