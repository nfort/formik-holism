import React from "react";
import { Select } from "../src/Select";
import { DefaultTheme, ThemeProvider } from "@holism/components";
import { ComponentMeta } from "@storybook/react";
import { Formik, Form, useFormikContext } from "formik";
import styled from "styled-components";

function FormikDebug() {
  const { values, touched, errors } = useFormikContext();
  return <pre>{JSON.stringify({ values, touched, errors }, null, 2)}</pre>;
}

const Field = styled.div`
  margin-bottom: 1rem;
`;

export default {
  title: "Select",
  component: Select,
} as ComponentMeta<typeof Select>;

export const Default = () => {
  return (
    <ThemeProvider theme={DefaultTheme}>
      <Formik initialValues={{ date: "", city: "Moscow", color: "blue" }} onSubmit={() => {}}>
        <Form>
          <Field>
            <Select
              name="date"
              placeholder="Дата"
              options={[
                { label: "2022-08-01", value: "2022-08-01" },
                { label: "2022-08-02", value: "2022-08-02" },
              ]}
            ></Select>
          </Field>
          <Field>
            <Select
              name="city"
              placeholder="Город"
              options={[
                { label: "Калининград", value: "Kaliningrad" },
                { label: "Москва", value: "Moscow" },
              ]}
            ></Select>
          </Field>
          <FormikDebug />
        </Form>
      </Formik>
    </ThemeProvider>
  );
};
