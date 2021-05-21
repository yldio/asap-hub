import { select } from '@storybook/addon-knobs';

import { RadioButtonGroup } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Radio Button Group',
  component: RadioButtonGroup,
};

export const Normal = () => (
  <RadioButtonGroup
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
