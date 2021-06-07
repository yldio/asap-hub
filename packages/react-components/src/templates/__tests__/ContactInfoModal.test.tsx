import { StaticRouter } from 'react-router-dom';
import { render, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactInfoModal from '../ContactInfoModal';

it('renders a form to edit the contact info', () => {
  const { getByText } = render(
    <ContactInfoModal fallbackEmail="fallback@example.com" backHref="#" />,
    { wrapper: StaticRouter },
  );
  expect(getByText(/contact/i, { selector: 'h3' })).toBeVisible();
});
it('shows the fallback email', () => {
  const { container } = render(
    <ContactInfoModal fallbackEmail="fallback@example.com" backHref="#" />,
    { wrapper: StaticRouter },
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
    { wrapper: StaticRouter },
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
    { wrapper: StaticRouter },
  );

  userEvent.clear(getByLabelText(/email/i));
  await userEvent.type(getByLabelText(/email/i), 'new-contact@example.com');
  userEvent.click(getByText(/save/i));
  expect(handleSave).toHaveBeenLastCalledWith(
    expect.objectContaining({ contactEmail: 'new-contact@example.com' }),
  );

  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});
it('does not fire onSave when the email is invalid', async () => {
  const handleSave = jest.fn();
  const { getByLabelText, getByText } = render(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      backHref="#"
      onSave={handleSave}
    />,
    { wrapper: StaticRouter },
  );

  userEvent.clear(getByLabelText(/email/i));
  await userEvent.type(getByLabelText(/email/i), '.');
  userEvent.click(getByText(/save/i));
  expect(handleSave).not.toHaveBeenCalled();
});

it('disables the form elements while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = render(
    <ContactInfoModal
      backHref="#"
      email="contact@example.com"
      fallbackEmail="fallback@example.com"
      onSave={handleSave}
    />,
    { wrapper: StaticRouter },
  );

  userEvent.click(getByText(/save/i));

  const form = getByText(/save/i).closest('form')!;
  expect(form.elements.length).toBeGreaterThan(1);
  [...form.elements].forEach((element) => expect(element).toBeDisabled());

  act(resolveSubmit);
  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});

it.each`
  label               | value        | message
  ${'Website 1'}      | ${'not url'} | ${'valid website'}
  ${'Website 2'}      | ${'not url'} | ${'valid website'}
  ${'ResearcherID'}   | ${'http://'} | ${'valid ResearcherID'}
  ${'Twitter'}        | ${'http://'} | ${'valid Twitter handle'}
  ${'Github'}         | ${'http://'} | ${'valid Github username'}
  ${'LinkedIn'}       | ${'http://'} | ${'valid LinkedIn username'}
  ${'Researchgate'}   | ${'http://'} | ${'valid Research Gate Profile ID'}
  ${'Google Scholar'} | ${'http://'} | ${'valid Google Scholar Profile ID'}
`(
  'shows validation message "$message" for $label input',
  async ({ label, value, message }) => {
    const { getByLabelText, findByText } = render(
      <ContactInfoModal backHref="#" fallbackEmail="fallback@example.com" />,
      { wrapper: StaticRouter },
    );
    const input = getByLabelText(new RegExp(label, 'i'));
    fireEvent.change(input, {
      target: { value },
    });
    fireEvent.focusOut(input);
    expect(await findByText(new RegExp(message, 'i'))).toBeVisible();
  },
);
