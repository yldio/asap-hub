import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Checkbox from '../Checkbox';

const props: ComponentProps<typeof Checkbox> = {
  groupName: '',
};

it('renders a checkbox', () => {
  const { getByRole } = render(<Checkbox {...props} />);
  expect(getByRole('checkbox')).toBeVisible();
});

it('renders a disabled checkbox', () => {
  const { getByRole } = render(<Checkbox {...props} enabled={false} />);
  expect(getByRole('checkbox')).toBeDisabled();
});

it('fires the select event', async () => {
  const handleChange = jest.fn();
  const { getByRole } = render(<Checkbox {...props} onSelect={handleChange} />);
  expect(handleChange.mock.calls.length).toBe(0);

  userEvent.click(getByRole('checkbox'));
  expect(handleChange.mock.calls.length).toBe(1);
});
