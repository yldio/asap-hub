import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CheckboxGroup from '../CheckboxGroup';

it('renders a checkbox for each option', () => {
  const { getByLabelText } = render(
    <CheckboxGroup
      options={[
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
      ]}
      values={new Set('red')}
    />,
  );
  expect(getByLabelText('Red')).toBeVisible();
  expect(getByLabelText('Blue')).toBeVisible();
});

it('renders title', () => {
  const { getByText } = render(
    <CheckboxGroup options={[{ title: 'A TITLE' }]} />,
  );
  expect(getByText('A TITLE')).toBeVisible();
});

it('checks specified checkboxes', () => {
  const { getByLabelText } = render(
    <CheckboxGroup
      options={[
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
      ]}
      values={new Set(['red', 'green'])}
    />,
  );
  expect(getByLabelText('Red')).toBeChecked();
  expect(getByLabelText('Green')).toBeChecked();
  expect(getByLabelText('Blue')).not.toBeChecked();
});

it('Disables specified checkboxes', () => {
  const { getByLabelText } = render(
    <CheckboxGroup
      options={[
        { value: 'red', label: 'Red', enabled: false },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green', enabled: false },
      ]}
    />,
  );
  expect(getByLabelText('Red')).toBeDisabled();
  expect(getByLabelText('Blue')).not.toBeDisabled();
  expect(getByLabelText('Green')).toBeDisabled();
});

it('assigns all checkboxes a unique group name', () => {
  const { getByLabelText } = render(
    <>
      <CheckboxGroup
        options={[
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' },
          { value: 'green', label: 'Green' },
        ]}
      />
      <CheckboxGroup options={[{ value: 'orange', label: 'Orange' }]} />
    </>,
  );
  expect((getByLabelText('Red') as HTMLInputElement).name).toEqual(
    (getByLabelText('Blue') as HTMLInputElement).name,
  );
  expect((getByLabelText('Red') as HTMLInputElement).name).not.toEqual(
    (getByLabelText('Orange') as HTMLInputElement).name,
  );
});

it('emits value changes', () => {
  const handleChange = jest.fn();
  const { getByLabelText } = render(
    <CheckboxGroup
      options={[
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
      ]}
      onChange={handleChange}
    />,
  );
  userEvent.click(getByLabelText('Red'));
  expect(handleChange).toHaveBeenLastCalledWith('red');
});
