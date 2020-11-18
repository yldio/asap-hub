import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactInfoModal from '../ContactInfoModal';

it('renders a form to edit the contact info', () => {
  const { getByRole } = render(
    <ContactInfoModal fallbackEmail="fallback@example.com" backHref="#" />,
  );
  expect(getByRole('heading')).toHaveTextContent(/contact/i);
});
it('shows the fallback email', () => {
  const { container } = render(
    <ContactInfoModal fallbackEmail="fallback@example.com" backHref="#" />,
  );
  expect(container.textContent).toContain('fallback@example.com');
});

it('renders a text field containing the email', () => {
  const { getByLabelText } = render(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      email="contact@example.com"
      backHref="#"
    />,
  );
  expect(getByLabelText(/email/i)).toHaveValue('contact@example.com');
});

it('fires onSave when submitting', async () => {
  const handleSave = jest.fn();
  const { getByLabelText, getByText } = render(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      backHref="#"
      onSave={handleSave}
    />,
  );

  userEvent.clear(getByLabelText(/email/i));
  await userEvent.type(getByLabelText(/email/i), 'new-contact@example.com');
  userEvent.click(getByText(/save/i));
  expect(handleSave).toHaveBeenLastCalledWith('new-contact@example.com');
});
it('does not fire onSave when the email is invalid', async () => {
  const handleSave = jest.fn();
  const { getByLabelText, getByText } = render(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      backHref="#"
      onSave={handleSave}
    />,
  );

  userEvent.clear(getByLabelText(/email/i));
  await userEvent.type(getByLabelText(/email/i), '.');
  userEvent.click(getByText(/save/i));
  expect(handleSave).not.toHaveBeenCalled();
});
