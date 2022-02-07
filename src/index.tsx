import React, { FC, HTMLAttributes, ReactChild } from 'react';

export { Input } from "./Input"

export interface Props extends HTMLAttributes<HTMLDivElement> {
  /** custom content, defaults to 'the snozzberries taste like snozzberries' */
  children?: ReactChild;
  /* Имя */
  name?: string
}

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */
export const Thing: FC<Props> = ({ children }) => {
  return <div>{children || `the snozzberries taste like snozzberries`}</div>;
};

interface ButtonProps {
  isDisabled: boolean;
  content: string;
}

export const Button: React.FC<ButtonProps> = ({ isDisabled = false, content = '' }) => {
  return (
    <button type="button" disabled={isDisabled}>
      {content}
    </button>
  );
};
