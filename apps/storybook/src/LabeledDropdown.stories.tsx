import { text, select, boolean } from '@storybook/addon-knobs';

import { LabeledDropdown } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Labeled Dropdown',
  component: LabeledDropdown,
};

export const Normal = () => (
  <LabeledDropdown
    title={text('Title', 'Airport')}
    subtitle={text('Subtitle', '(Optional)')}
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
    description={text('Description', 'Please select your origin airport')}
    enabled={boolean('Enabled', true)}
  />
);

export const Required = () => (
  <LabeledDropdown
    title={text('Title', 'Airport')}
    subtitle={text('Subtitle', '(Required)')}
    required={true}
    options={[
      { value: 'LHR', label: 'Heathrow' },
      { value: 'LGW', label: 'Gatwick' },
      { value: 'STN', label: 'Stansted' },
      { value: 'LTN', label: 'Luton' },
      { value: 'LCY', label: 'City' },
      { value: 'SEN', label: 'Southend' },
    ]}
    value=""
    enabled={boolean('Enabled', true)}
    description={text('Description', '')}
  />
);
export const EmptyOption = () => (
  <LabeledDropdown
    title={text('Title', 'Airport')}
    placeholder={text('Empty Label', 'Select airport')}
    subtitle={text('Subtitle', '')}
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
    description={text('Description', '')}
    enabled={boolean('Enabled', true)}
  />
);
export const Invalid = () => (
  <LabeledDropdown
    title={text('Title', 'Airport')}
    subtitle={text('Subtitle', '')}
    required={true}
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
    description={text('Description', '')}
    enabled={boolean('Enabled', true)}
  />
);
