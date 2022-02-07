import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Input } from '../src/Input';
import { Formik } from 'formik';

const meta = {
  title: 'Input',
  component: Input,
} as ComponentMeta<typeof Input>;

export default meta;

export const Primary: ComponentStory<typeof Input> = (args) => (
  <Formik initialValues={{ firstName: 'Ivan' }} onSubmit={console.log}>
    <Input name="firstName" placeholder="First name" {...args} />
  </Formik>
);
