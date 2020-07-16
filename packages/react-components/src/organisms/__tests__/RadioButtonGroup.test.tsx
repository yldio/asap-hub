import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RadioButtonGroup from '../RadioButtonGroup';

it('renders a radio button for each option', () => {
  const { getByLabelText } = render(
    <RadioButtonGroup
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      value="LHR"
    />,
  );
  expect(getByLabelText('Heathrow')).toBeVisible();
  expect(getByLabelText('Gatwick')).toBeVisible();
});

it('checks the radio button with the current value', () => {
  const { getByLabelText } = render(
    <RadioButtonGroup
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      value="LHR"
    />,
  );
  expect(getByLabelText('Heathrow')).toBeChecked();
  expect(getByLabelText('Gatwick')).not.toBeChecked();
});

it('assigns all radio buttons a unique group name', () => {
  const { getByLabelText } = render(
    <>
      <RadioButtonGroup
        options={[
          { value: 'LHR', label: 'Heathrow' },
          { value: 'LGW', label: 'Gatwick' },
        ]}
        value="LHR"
      />
      <RadioButtonGroup
        options={[{ value: 'LCY', label: 'City' }]}
        value="LCY"
      />
    </>,
  );
  expect((getByLabelText('Heathrow') as HTMLInputElement).name).toEqual(
    (getByLabelText('Gatwick') as HTMLInputElement).name,
  );
  expect((getByLabelText('Heathrow') as HTMLInputElement).name).not.toEqual(
    (getByLabelText('City') as HTMLInputElement).name,
  );
});

it('emits value changes', () => {
  const handleChange = jest.fn();
  const { getByLabelText } = render(
    <RadioButtonGroup
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      value="LHR"
      onChange={handleChange}
    />,
  );
  userEvent.click(getByLabelText('Gatwick'));
  expect(handleChange).toHaveBeenLastCalledWith('LGW');
});
