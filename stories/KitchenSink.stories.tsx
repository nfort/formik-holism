import React from "react";
import { KitchenSink } from "./KitchenSink";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
  title: "KitchenSink",
  component: KitchenSink,
} as ComponentMeta<typeof KitchenSink>;

export const Form: ComponentStory<typeof KitchenSink> = () => <KitchenSink />;
