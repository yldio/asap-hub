// apps/storybook/src/migration/Typeahead.stories.tsx
// Migration verification stories for Typeahead (via LabeledTypeahead)

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LabeledTypeahead } from '@asap-hub/react-components';

// Mock data - Typeahead uses string arrays, not option objects
const stringOptions = [
  'Option 1',
  'Option 2',
  'Option 3',
  'Option 4',
  'Option 5',
];

const meta: Meta<typeof LabeledTypeahead> = {
  title: 'Migration/Typeahead',
  component: LabeledTypeahead,
  parameters: {
    docs: {
      description: {
        component:
          'Migration verification stories for Typeahead via LabeledTypeahead.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LabeledTypeahead>;

// ==================== BASIC SEARCH ====================
export const BasicSearch: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <div>
        <p style={{ marginBottom: 16, color: '#666' }}>
          <strong>Test:</strong> Type &quot;Option&quot; to filter suggestions.
        </p>
        <LabeledTypeahead
          title="Search Options"
          suggestions={stringOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// ==================== ASYNC LOADING ====================
const loadOptionsMock =
  (options: string[], delay = 500) =>
  (inputValue?: string): Promise<string[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          options.filter((o) =>
            o.toLowerCase().includes((inputValue || '').toLowerCase()),
          ),
        );
      }, delay);
    });

export const AsyncLoading: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <div>
        <p style={{ marginBottom: 16, color: '#666' }}>
          <strong>Test:</strong> Type to trigger async search. Loading indicator
          should appear for 500ms.
        </p>
        <LabeledTypeahead
          title="Async Search"
          loadOptions={loadOptionsMock(stringOptions, 500)}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// ==================== NO RESULTS ====================
export const NoResults: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <div>
        <p style={{ marginBottom: 16, color: '#666' }}>
          <strong>Test:</strong> Type &quot;xyz&quot; to see no matching
          suggestions.
        </p>
        <LabeledTypeahead
          title="No Results Test"
          suggestions={stringOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// ==================== WITH INITIAL VALUE ====================
export const WithInitialValue: Story = {
  render: () => {
    const [value, setValue] = useState<string>('Option 2');
    return (
      <LabeledTypeahead
        title="Pre-filled Typeahead"
        suggestions={stringOptions}
        value={value}
        onChange={setValue}
      />
    );
  },
};

// ==================== DISABLED ====================
export const Disabled: Story = {
  render: () => (
    <LabeledTypeahead
      title="Disabled Typeahead"
      suggestions={stringOptions}
      value="Option 1"
      onChange={() => {}}
      enabled={false}
    />
  ),
};

// ==================== REQUIRED ====================
export const Required: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <LabeledTypeahead
        title="Required Field"
        subtitle="(Required)"
        suggestions={stringOptions}
        value={value}
        onChange={setValue}
        required
      />
    );
  },
};

// ==================== WITH MAX LENGTH ====================
export const WithMaxLength: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <div>
        <p style={{ marginBottom: 16, color: '#666' }}>
          <strong>Test:</strong> Maximum 20 characters allowed.
        </p>
        <LabeledTypeahead
          title="Max Length Test"
          suggestions={stringOptions}
          value={value}
          onChange={setValue}
          maxLength={20}
        />
      </div>
    );
  },
};
