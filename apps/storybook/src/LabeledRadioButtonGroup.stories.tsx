import { LabeledRadioButtonGroup } from '@asap-hub/react-components';

import { text, select } from './knobs';

export default {
  title: 'Molecules / Labeled Radio Button Group',
  component: LabeledRadioButtonGroup,
};

export const Normal = () => (
  <LabeledRadioButtonGroup
    title={text('Title', 'Airports')}
    subtitle={text('Subtitle', '(required)')}
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
  />
);
