import { optionsKnob } from '@storybook/addon-knobs';

import { CheckboxGroup } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Checkbox Group',
  component: CheckboxGroup,
};

export const Normal = () => (
  <CheckboxGroup
    options={[
      { value: 'LHR', label: 'Heathrow' },
      { value: 'LGW', label: 'Gatwick' },
      { value: 'STN', label: 'Stansted' },
      { value: 'LTN', label: 'Luton' },
      { value: 'LCY', label: 'City' },
      { value: 'SEN', label: 'Southend' },
    ]}
    values={
      optionsKnob(
        'Values',
        {
          Heathrow: 'LHR',
          Gatwick: 'LGW',
          Stansted: 'STN',
          Luton: 'LTN',
          City: 'LCY',
          Southend: 'SEN',
        },
        ['LHR'],
        {
          display: 'inline-check',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any
    }
  />
);
