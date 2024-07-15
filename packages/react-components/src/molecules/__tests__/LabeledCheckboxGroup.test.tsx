import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LabeledCheckboxGroup from '../LabeledCheckboxGroup';

it('renders a section title', () => {
  render(
    <LabeledCheckboxGroup
      title="Group title"
      options={[]}
      values={new Set()}
    />,
  );
  expect(screen.getByText(/Group title/i)).toBeVisible();
});

it('renders a section subtitle', () => {
  render(
    <LabeledCheckboxGroup
      subtitle="Group description"
      options={[]}
      values={new Set()}
    />,
  );
  expect(screen.getByText(/Group description/i)).toBeVisible();
});

it('renders a checkbox button for each option', () => {
  const { getByLabelText } = render(
    <LabeledCheckboxGroup
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      values={new Set(['LHR'])}
    />,
  );
  expect(getByLabelText('Heathrow')).toBeVisible();
  expect(getByLabelText('Gatwick')).toBeVisible();
});

it('checks the checkbox button with the current value', () => {
  const { getByLabelText } = render(
    <LabeledCheckboxGroup
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      values={new Set(['LHR'])}
    />,
  );
  expect(getByLabelText('Heathrow')).toBeChecked();
  expect(getByLabelText('Gatwick')).not.toBeChecked();
});

it('checks the checkbox button with more than one value selected', () => {
  const { getByLabelText } = render(
    <LabeledCheckboxGroup
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      values={new Set(['LHR', 'LGW'])}
    />,
  );
  expect(getByLabelText('Heathrow')).toBeChecked();
  expect(getByLabelText('Gatwick')).toBeChecked();
});

it('emits value changes', () => {
  const handleChange = jest.fn();
  const { getByLabelText } = render(
    <LabeledCheckboxGroup
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      values={new Set('LHR')}
      onChange={handleChange}
    />,
  );
  userEvent.click(getByLabelText('Gatwick'));
  expect(handleChange).toHaveBeenLastCalledWith('LGW');
});

it('renders the validation message', () => {
  render(
    <LabeledCheckboxGroup
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      values={new Set()}
      validationMessage="Please select an option"
    />,
  );

  expect(screen.getByText(/Please select an option/i)).toBeVisible();
});
