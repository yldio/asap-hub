import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { LabeledDropdown } from '@asap-hub/react-components';

// Mock data
const basicOptions = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
  { value: 'opt4', label: 'Option 4' },
  { value: 'opt5', label: 'Option 5' },
];

const optionsWithDescriptions = [
  { value: 'research', label: 'Research Article' },
  { value: 'review', label: 'Review Article' },
  { value: 'preprint', label: 'Preprint' },
];

const meta: Meta<typeof LabeledDropdown> = {
  title: 'Migration/Dropdown',
  component: LabeledDropdown,
  parameters: {
    docs: {
      description: {
        component:
          'Migration verification stories for single-select Dropdown via LabeledDropdown.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LabeledDropdown>;

// ==================== BASIC ====================
export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <LabeledDropdown
        title="Select Option"
        options={basicOptions}
        value={value}
        onChange={setValue}
        placeholder="Select an option..."
      />
    );
  },
};

// ==================== WITH INITIAL VALUE ====================
export const WithInitialValue: Story = {
  render: () => {
    const [value, setValue] = useState<string>('opt2');
    return (
      <LabeledDropdown
        title="Select Option"
        options={basicOptions}
        value={value}
        onChange={setValue}
        placeholder="Select an option..."
      />
    );
  },
};

// ==================== DISABLED ====================
export const Disabled: Story = {
  render: () => (
    <LabeledDropdown
      title="Disabled Dropdown"
      options={basicOptions}
      value="opt1"
      onChange={() => {}}
      enabled={false}
    />
  ),
};

// ==================== REQUIRED (INVALID STATE) ====================
export const Required: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <LabeledDropdown
        title="Required Field"
        subtitle="(Required)"
        options={basicOptions}
        value={value}
        onChange={setValue}
        placeholder="Required field"
        required
      />
    );
  },
};

// ==================== CUSTOM RENDER VALUE ====================
export const CustomRenderValue: Story = {
  render: () => {
    const [value, setValue] = useState<string>('research');
    return (
      <LabeledDropdown
        title="Document Type"
        options={optionsWithDescriptions}
        value={value}
        onChange={setValue}
        renderValue={(val) => `Selected: ${val}`}
      />
    );
  },
};

// ==================== WITH DESCRIPTION ====================
export const WithDescription: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <LabeledDropdown
        title="Airport"
        subtitle="(Optional)"
        description="Please select your origin airport"
        options={basicOptions}
        value={value}
        onChange={setValue}
        placeholder="Select airport..."
      />
    );
  },
};
