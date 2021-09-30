import { ComponentProps } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, StaticRouter } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';
import { fireEvent } from '@testing-library/dom';

import PersonalInfoModal from '../PersonalInfoModal';

const props: ComponentProps<typeof PersonalInfoModal> = {
  ...createUserResponse(),
  countrySuggestions: [],
  loadInstitutionOptions: () => Promise.resolve([]),
  backHref: '/wrong',
};
it('renders the title', () => {
  const { getByText } = render(
    <PersonalInfoModal
      countrySuggestions={[]}
      loadInstitutionOptions={() => Promise.resolve([])}
      backHref="/wrong"
    />,
    {
      wrapper: StaticRouter,
    },
  );
  expect(getByText('Your details', { selector: 'h3' })).toBeVisible();
});

it('renders a country selector', async () => {
  const { getByText } = render(
    <PersonalInfoModal
      country=""
      countrySuggestions={['United States', 'Australia', 'Canada']}
      loadInstitutionOptions={() => Promise.resolve([])}
      backHref="/wrong"
    />,
    {
      wrapper: StaticRouter,
    },
  );

  userEvent.click(getByText('Select'));

  expect(getByText('United States')).toBeVisible();
  expect(getByText('Australia')).toBeVisible();
  expect(getByText('Canada')).toBeVisible();
});

it('indicates which fields are required or optional', () => {
  const { getByText } = render(
    <PersonalInfoModal
      countrySuggestions={[]}
      loadInstitutionOptions={() => Promise.resolve([])}
      backHref="/wrong"
    />,
    {
      wrapper: StaticRouter,
    },
  );

  [
    { title: 'First name', subtitle: 'Required' },
    { title: 'Last name(s)', subtitle: 'Required' },
    { title: 'Degree', subtitle: 'Optional' },
    { title: 'Institution', subtitle: 'Required' },
    { title: 'Position', subtitle: 'Required' },
    { title: 'Country', subtitle: 'Required' },
    { title: 'City', subtitle: 'Required' },
  ].forEach(({ title, subtitle }) =>
    expect(getByText(title).nextSibling?.textContent).toContain(subtitle),
  );
});

it('renders default values into text inputs', () => {
  const { queryAllByRole } = render(
    <PersonalInfoModal
      {...props}
      firstName="firstName"
      lastName="lastName"
      country="country"
      city="city"
      jobTitle="jobTitle"
      institution="institution"
    />,
    { wrapper: StaticRouter },
  );
  expect(queryAllByRole('textbox').map((input) => input.getAttribute('value')))
    .toMatchInlineSnapshot(`
    Array [
      "firstName",
      "lastName",
      "",
      "institution",
      "jobTitle",
      "country",
      "city",
    ]
  `);
});

it.each`
  label             | value | message
  ${/country/i}     | ${''} | ${'Please add your country'}
  ${/city/i}        | ${''} | ${'Please add your city'}
  ${/institution/i} | ${''} | ${'Please add your institution'}
`(
  'shows validation message $message when value set to $value on $label',
  async ({ label, value, message }) => {
    const { getByLabelText, findByText } = render(
      <PersonalInfoModal {...props} />,
      { wrapper: StaticRouter },
    );
    const input = getByLabelText(label);
    fireEvent.change(input, {
      target: { value },
    });
    fireEvent.focusOut(input);
    expect(await findByText(new RegExp(message, 'i'))).toBeVisible();
  },
);

it('triggers the save function', async () => {
  const jestFn = jest.fn();
  const { getByText } = render(
    <PersonalInfoModal
      {...props}
      firstName="firstName"
      lastName="lastName"
      country="country"
      city="city"
      jobTitle="jobTitle"
      institution="institution"
      degree="MPH"
      onSave={jestFn}
    />,
    { wrapper: MemoryRouter },
  );

  userEvent.click(getByText('Save'));
  expect(jestFn).toHaveBeenCalledWith({
    firstName: 'firstName',
    lastName: 'lastName',
    country: 'country',
    city: 'city',
    degree: 'MPH',
    jobTitle: 'jobTitle',
    institution: 'institution',
  });

  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});

it('disables the form elements while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = render(
    <PersonalInfoModal {...props} onSave={handleSave} />,
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
