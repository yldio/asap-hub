import { StaticRouter } from 'react-router-dom';
import { render, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserResponse } from '@asap-hub/model';

import ContactInfoModal from '../ContactInfoModal';

it('renders a form to edit the contact info', () => {
  const { getByText } = render(
    <ContactInfoModal fallbackEmail="fallback@example.com" backHref="#" />,
    { wrapper: StaticRouter },
  );
  expect(getByText(/contact/i, { selector: 'h3' })).toBeVisible();
});

it('indicates which fields are optional', () => {
  const { getByText } = render(
    <ContactInfoModal fallbackEmail="fallback@example.com" backHref="#" />,
    { wrapper: StaticRouter },
  );

  [
    { title: 'Contact email', subtitle: 'optional' },
    { title: 'Website 1', subtitle: 'optional' },
    { title: 'Website 2', subtitle: 'optional' },
    { title: 'Researcher ID', subtitle: 'optional' },
    { title: 'X', subtitle: 'optional' },
    { title: 'Github', subtitle: 'optional' },
    { title: 'LinkedIn', subtitle: 'optional' },
    { title: 'Research Gate', subtitle: 'optional' },
    { title: 'Google Scholar', subtitle: 'optional' },
  ].forEach(({ title, subtitle }) =>
    expect(
      getByText(title, { selector: 'strong' }).nextSibling?.textContent,
    ).toContain(subtitle),
  );
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
  label               | value
  ${'Website 1'}      | ${`website1`}
  ${'Website 2'}      | ${`website2`}
  ${'Researcher ID'}  | ${`researcherId`}
  ${'X'}              | ${`twitter`}
  ${'Github'}         | ${`github`}
  ${'LinkedIn'}       | ${`linkedIn`}
  ${'Research Gate'}  | ${`researchGate`}
  ${'Google Scholar'} | ${`googleScholar`}
`('displays value $value for $label', ({ label, value }) => {
  const social: Required<UserResponse['social']> = {
    github: 'github',
    googleScholar: 'googleScholar',
    linkedIn: 'linkedIn',
    orcid: 'orcid',
    researchGate: 'researchGate',
    researcherId: 'researcherId',
    twitter: 'twitter',
    website1: 'website1',
    website2: 'website2',
  };
  const { getByLabelText } = render(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      email="contact@example.com"
      social={social}
      backHref="#"
    />,
    { wrapper: StaticRouter },
  );
  const input = getByLabelText(new RegExp(label));
  expect(input).toHaveValue(value);
});

it.each`
  label               | value        | message
  ${'Website 1'}      | ${'not url'} | ${'valid URL'}
  ${'Website 2'}      | ${'not url'} | ${'valid URL'}
  ${'Researcher ID'}  | ${'http://'} | ${'valid Researcher ID'}
  ${'X'}              | ${'http://'} | ${'valid Twitter handle'}
  ${'Github'}         | ${'http://'} | ${'valid Github username'}
  ${'LinkedIn'}       | ${'http://'} | ${'valid LinkedIn username'}
  ${'Research Gate'}  | ${'http://'} | ${'valid Research Gate Profile ID'}
  ${'Google Scholar'} | ${'http://'} | ${'valid Google Scholar Profile ID'}
`(
  'shows validation message "$message" for $label input',
  async ({ label, value, message }) => {
    const { getByLabelText, findByText } = render(
      <ContactInfoModal backHref="#" fallbackEmail="fallback@example.com" />,
      { wrapper: StaticRouter },
    );
    const input = getByLabelText(new RegExp(label));
    fireEvent.change(input, {
      target: { value },
    });
    fireEvent.focusOut(input);
    expect(await findByText(new RegExp(message, 'i'))).toBeVisible();
  },
);
