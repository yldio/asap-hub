import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Combobox } from "@/components/ui/combobox";

const meta: Meta<typeof Combobox> = {
  title: "UI/Combobox",
  component: Combobox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the input",
    },
    disabled: {
      control: "boolean",
      description: "Whether the combobox is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

// Showcase all features
const ShowcaseComponent = () => {
  const [colorValue, setColorValue] = useState("");

  const colorOptions = [
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "yellow", label: "Yellow" },
    { value: "purple", label: "Purple" },
    { value: "orange", label: "Orange" },
    { value: "pink", label: "Pink" },
    { value: "brown", label: "Brown" },
  ];

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <h3 className="text-lg font-semibold mb-2">Color Selector</h3>
        <Combobox
          options={colorOptions}
          value={colorValue}
          onValueChange={setColorValue}
          placeholder="Choose a color..."
        />
        {colorValue && (
          <p className="mt-2 text-sm text-muted-foreground">
            Selected color:{" "}
            {colorOptions.find((c) => c.value === colorValue)?.label}
          </p>
        )}
      </div>
    </div>
  );
};

export const Showcase: Story = {
  render: ShowcaseComponent,
};
