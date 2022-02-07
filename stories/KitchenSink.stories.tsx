import React from "react";
import { KitchenSink } from "../src/KitchenSink";
import { ComponentStory } from "@storybook/react";

export default {
  title: "KitchenSink",
  component: KitchenSink,
};

export const Form: ComponentStory<typeof KitchenSink> = () => <KitchenSink />;
