import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BiographyModal from '../BiographyModal';

it('renders a form to edit the biography', () => {
  const { getByRole } = render(<BiographyModal backHref="#" />);
  expect(getByRole('heading')).toHaveTextContent(/bio/i);
});

it('renders a text field containing the biography', () => {
  const { getByDisplayValue } = render(
    <BiographyModal backHref="#" biography="My Bio" />,
  );
  expect(getByDisplayValue('My Bio')).toBeEnabled();
});

it('fires onSave when submitting', async () => {
  const handleSave = jest.fn();
  const { getByDisplayValue, getByText } = render(
    <BiographyModal backHref="#" biography="My Bio" onSave={handleSave} />,
  );

  await userEvent.type(getByDisplayValue('My Bio'), ' 2');
  userEvent.click(getByText(/save/i));
  expect(handleSave).toHaveBeenLastCalledWith('My Bio 2');
});
it('does not fire onSave when the bio is missing', () => {
  const handleSave = jest.fn();
  const { getByDisplayValue, getByText } = render(
    <BiographyModal backHref="#" biography="My Bio" onSave={handleSave} />,
  );

  userEvent.clear(getByDisplayValue('My Bio'));
  userEvent.click(getByText(/save/i));
  expect(handleSave).not.toHaveBeenCalled();
});
