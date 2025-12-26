import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RadioButton from '../RadioButton';

it('renders a radio button input, passing through props', () => {
  const { getByRole } = render(<RadioButton groupName="airport" checked />);
  expect(getByRole('radio')).toBeChecked();
});

it('emits a select event when enabling', async () => {
  const handleSelect = jest.fn();
  const { getByRole } = render(
    <RadioButton groupName="airport" onSelect={handleSelect} />,
  );
  await userEvent.click(getByRole('radio'));
  expect(handleSelect).toHaveBeenCalled();
});

it('does not emit a select event when disabling', async () => {
  const handleSelect = jest.fn();
  const { getByRole } = render(
    <RadioButton groupName="airport" checked onSelect={handleSelect} />,
  );
  await userEvent.click(getByRole('radio'));
  expect(handleSelect).not.toHaveBeenCalled();
});
