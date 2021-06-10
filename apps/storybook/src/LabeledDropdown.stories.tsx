import { text, select, boolean } from '@storybook/addon-knobs';

import { LabeledDropdown } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Labeled Dropdown',
  component: LabeledDropdown,
};

export const Normal = () => (
  <LabeledDropdown
    title={text('Title', 'Airport')}
    options={[
      { value: 'LHR', label: 'Heathrow' },
      { value: 'LGW', label: 'Gatwick' },
      { value: 'STN', label: 'Stansted' },
      { value: 'LTN', label: 'Luton' },
      { value: 'LCY', label: 'City' },
      { value: 'SEN', label: 'Southend' },
    ]}
    value={select(
      'Value',
      {
        Heathrow: 'LHR',
        Gatwick: 'LGW',
        Stansted: 'STN',
        Luton: 'LTN',
        City: 'LCY',
        Southend: 'SEN',
      },
      'LHR',
    )}
    enabled={boolean('Enabled', true)}
  />
);
export const EmptyOption = () => (
  <LabeledDropdown
    title={text('Title', 'Airport')}
    options={[
      { value: '', label: text('Empty Label', 'Select airport') },
      { value: 'LHR', label: 'Heathrow' },
      { value: 'LGW', label: 'Gatwick' },
      { value: 'STN', label: 'Stansted' },
      { value: 'LTN', label: 'Luton' },
      { value: 'LCY', label: 'City' },
      { value: 'SEN', label: 'Southend' },
    ]}
    value=""
    enabled={boolean('Enabled', true)}
  />
);
export const Invalid = () => (
  <LabeledDropdown
    title={text('Title', 'Airport')}
    options={[
      { value: 'LHR', label: 'Heathrow' },
      { value: 'LGW', label: 'Gatwick' },
      { value: 'STN', label: 'Stansted' },
      { value: 'LTN', label: 'Luton' },
      { value: 'LCY', label: 'City' },
      { value: 'SEN', label: 'Southend' },
    ]}
    value="LHR"
    customValidationMessage={text(
      'Validation Error Message',
      'This airport is currently closed.',
    )}
    enabled={boolean('Enabled', true)}
  />
);
