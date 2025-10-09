import { LabeledCheckboxGroup } from '@asap-hub/react-components';

import { text } from './knobs';

export default {
  title: 'Molecules / Labeled Checkbox Group',
  component: LabeledCheckboxGroup,
};

export const AllLabels = () => (
  <LabeledCheckboxGroup
    options={[
      { value: 'LHR', label: 'Heathrow' },
      { value: 'LGW', label: 'Gatwick' },
      { value: 'STN', label: 'Stansted', enabled: false },
      { value: 'LTN', label: 'Luton', enabled: false },
      { value: 'LCY', label: 'City' },
    ]}
    title={text('Title', 'Airports')}
    subtitle={text('Subtitle', '(Required)')}
    description={text(
      'Description',
      'Select your preferred airports for departure',
    )}
    values={new Set(['LHR', 'LGW'])}
  />
);

export const Invalid = () => (
  <LabeledCheckboxGroup
    options={[
      { value: 'LHR', label: 'Heathrow' },
      { value: 'LGW', label: 'Gatwick' },
      { value: 'STN', label: 'Stansted' },
      { value: 'LTN', label: 'Luton' },
      { value: 'LCY', label: 'City' },
      { value: 'SEN', label: 'Southend' },
    ]}
    title={text('Title', 'Airports')}
    subtitle={text('Subtitle', '(Required)')}
    description={text('Description', 'Select at least one airport')}
    values={new Set()}
    validationMessage={text(
      'Validation Error Message',
      'Please select at least one option.',
    )}
  />
);
