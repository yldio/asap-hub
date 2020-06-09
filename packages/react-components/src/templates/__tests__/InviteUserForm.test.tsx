import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import InviteUserForm from '../InviteUserForm';

it('renders a user invitation form', () => {
  const { getAllByLabelText, getByRole } = render(<InviteUserForm />);
  expect(
    getAllByLabelText(/.*/).flatMap((input) =>
      [...((input as HTMLInputElement).labels ?? [])].map(
        ({ textContent }) => textContent,
      ),
    ),
  ).toMatchInlineSnapshot(`
    Array [
      "Invitee Full Name",
      "Invitee E-Mail Address",
      "Administrator Password",
    ]
  `);
  expect(getByRole('button')).toHaveTextContent(/invite/i);
});

it('submits the entered data', async () => {
  const onSubmit = jest.fn();
  const { getByLabelText, getByRole } = render(
    <InviteUserForm onSubmit={onSubmit} />,
  );

  await userEvent.type(getByLabelText(/name/i), 'John Doe', {
    allAtOnce: true,
  });
  await userEvent.type(getByLabelText(/e-?mail/i), 'john.doe@example.com', {
    allAtOnce: true,
  });
  await userEvent.type(getByLabelText(/password/i), 'Pw123', {
    allAtOnce: true,
  });
  userEvent.click(getByRole('button'));

  expect(onSubmit).toHaveBeenCalledWith(
    { displayName: 'John Doe', email: 'john.doe@example.com' },
    'Pw123',
  );
});

it('does not submit if there are validation errors', async () => {
  const onSubmit = jest.fn();
  const { getByRole } = render(<InviteUserForm onSubmit={onSubmit} />);

  userEvent.click(getByRole('button'));

  expect(onSubmit).not.toHaveBeenCalled();
});
