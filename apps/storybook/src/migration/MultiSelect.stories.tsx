// apps/storybook/src/migration/MultiSelect.stories.tsx
// Migration verification stories for MultiSelect (via LabeledMultiSelect)

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  LabeledMultiSelect,
  MultiSelectOptionsType,
} from '@asap-hub/react-components';

// Mock data
const multiSelectOptions: MultiSelectOptionsType[] = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
  { value: 'opt4', label: 'Option 4' },
  { value: 'opt5', label: 'Option 5' },
];

const meta: Meta<typeof LabeledMultiSelect> = {
  title: 'Migration/MultiSelect',
  component: LabeledMultiSelect,
  parameters: {
    docs: {
      description: {
        component:
          'Migration verification stories for MultiSelect via LabeledMultiSelect.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LabeledMultiSelect>;

// ==================== BASIC ====================
export const Basic: Story = {
  render: () => {
    const [values, setValues] = useState<MultiSelectOptionsType[]>([]);
    return (
      <LabeledMultiSelect
        title="Select Options"
        suggestions={multiSelectOptions}
        values={values}
        onChange={(newValues) => setValues([...newValues])}
        placeholder="Select multiple options..."
      />
    );
  },
};

// ==================== WITH INITIAL VALUES ====================
export const WithInitialValues: Story = {
  render: () => {
    const [values, setValues] = useState<MultiSelectOptionsType[]>([
      multiSelectOptions[0]!,
      multiSelectOptions[1]!,
      multiSelectOptions[2]!,
    ]);
    return (
      <LabeledMultiSelect
        title="Pre-selected Options"
        suggestions={multiSelectOptions}
        values={values}
        onChange={(newValues) => setValues([...newValues])}
      />
    );
  },
};

// NOTE: DragAndDrop story REMOVED - sortable functionality is being removed

// ==================== REMOVE ITEM ====================
export const RemoveItem: Story = {
  render: () => {
    const [values, setValues] = useState<MultiSelectOptionsType[]>([
      multiSelectOptions[0]!,
      multiSelectOptions[1]!,
    ]);
    return (
      <div>
        <p style={{ marginBottom: 16, color: '#666' }}>
          <strong>Test:</strong> Click the X on any tag to remove it.
        </p>
        <LabeledMultiSelect
          title="Remove Items Test"
          suggestions={multiSelectOptions}
          values={values}
          onChange={(newValues) => setValues([...newValues])}
        />
      </div>
    );
  },
};

// ==================== DISABLED ====================
export const Disabled: Story = {
  render: () => (
    <LabeledMultiSelect
      title="Disabled MultiSelect"
      suggestions={multiSelectOptions}
      values={[multiSelectOptions[0]!, multiSelectOptions[1]!]}
      onChange={() => {}}
      enabled={false}
    />
  ),
};

// ==================== CREATABLE ====================
export const Creatable: Story = {
  render: () => {
    const [values, setValues] = useState<MultiSelectOptionsType[]>([]);
    return (
      <div>
        <p style={{ marginBottom: 16, color: '#666' }}>
          <strong>Test:</strong> Type a new value and press Enter to create it.
        </p>
        <LabeledMultiSelect
          title="Creatable MultiSelect"
          suggestions={multiSelectOptions}
          values={values}
          onChange={(newValues) => setValues([...newValues])}
          placeholder="Type to create new options..."
          creatable
        />
      </div>
    );
  },
};

// ==================== REQUIRED ====================
export const Required: Story = {
  render: () => {
    const [values, setValues] = useState<MultiSelectOptionsType[]>([]);
    return (
      <LabeledMultiSelect
        title="Required Field"
        subtitle="(Required)"
        suggestions={multiSelectOptions}
        values={values}
        onChange={(newValues) => setValues([...newValues])}
        placeholder="Required field"
      />
    );
  },
};

// ==================== WITH DESCRIPTION ====================
export const WithDescription: Story = {
  render: () => {
    const [values, setValues] = useState<MultiSelectOptionsType[]>([]);
    return (
      <LabeledMultiSelect
        title="Tags"
        subtitle="(Required)"
        description="Select the keywords that best apply to your work. Please add a minimum of 5 tags."
        suggestions={multiSelectOptions}
        values={values}
        onChange={(newValues) => setValues([...newValues])}
        placeholder="Add a tag..."
      />
    );
  },
};

// ==================== ASYNC LOADING ====================
const loadOptionsMock =
  (options: MultiSelectOptionsType[], delay = 500) =>
  (inputValue: string): Promise<MultiSelectOptionsType[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          options.filter((o) =>
            o.label.toLowerCase().includes(inputValue.toLowerCase()),
          ),
        );
      }, delay);
    });

export const AsyncLoading: Story = {
  render: () => {
    const [values, setValues] = useState<MultiSelectOptionsType[]>([]);
    return (
      <div>
        <p style={{ marginBottom: 16, color: '#666' }}>
          <strong>Test:</strong> Type to trigger async search. Loading indicator
          should appear.
        </p>
        <LabeledMultiSelect
          title="Async MultiSelect"
          loadOptions={loadOptionsMock(multiSelectOptions, 500)}
          values={values}
          onChange={(newValues) => setValues([...newValues])}
          placeholder="Type to search..."
        />
      </div>
    );
  },
};
