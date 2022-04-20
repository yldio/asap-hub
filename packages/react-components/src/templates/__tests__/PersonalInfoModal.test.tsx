import { createUserResponse } from '@asap-hub/fixtures';
import { fireEvent } from '@testing-library/dom';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter, StaticRouter } from 'react-router-dom';
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
      {...props}
      loadInstitutionOptions={() => Promise.resolve([])}
      backHref="/wrong"
    />,
    {
      wrapper: StaticRouter,
    },
  );
  expect(getByText('Your details', { selector: 'h3' })).toBeVisible();
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
      countrySuggestions={['United States', 'Mexico']}
      firstName="firstName"
      lastName="lastName"
      country="United States"
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
      "United States",
      "city",
    ]
  `);
});

it('renders a country selector', () => {
  const { getByText, queryByText } = render(
    <PersonalInfoModal
      {...props}
      countrySuggestions={['United States', 'Mexico']}
      country=""
    />,
    {
      wrapper: StaticRouter,
    },
  );

  userEvent.click(getByText('Start Typing...'));
  expect(queryByText('United States')).toBeVisible();
  expect(queryByText('Mexico')).toBeVisible();

  userEvent.click(getByText('Start Typing...'));
  userEvent.type(getByText('Start Typing...'), 'xx');
  expect(queryByText(/no+countries/i)).toBeDefined();
});

it.each`
  label             | message
  ${/country/i}     | ${'Please add your country'}
  ${/city/i}        | ${'Please add your city'}
  ${/institution/i} | ${'Please add your institution'}
  ${/position/i}    | ${'Please add your position'}
`(
  'shows validation message $message when value set to $value on $label',
  async ({ label, message }) => {
    const { getByLabelText, findByText, getByText } = render(
      <PersonalInfoModal
        {...props}
        country="Spain"
        countrySuggestions={['Spain']}
        institution="UCM"
        city="Madrid"
        jobTitle="Assistant Professor"
      />,
      {
        wrapper: StaticRouter,
      },
    );
    const field = getByLabelText(label);
    const input = field.closest('input') || field;

    fireEvent.change(input, { target: { value: '' } });
    expect(input).toHaveValue('');

    userEvent.click(getByText(/save/i));
    expect(await findByText(new RegExp(message, 'i'))).toBeVisible();
  },
);

it('triggers the save function', async () => {
  const jestFn = jest.fn();
  const { getByText } = render(
    <PersonalInfoModal
      {...props}
      countrySuggestions={['United States', 'Mexico']}
      firstName="firstName"
      lastName="lastName"
      country="United States"
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
    country: 'United States',
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
    <PersonalInfoModal
      {...props}
      onSave={handleSave}
      countrySuggestions={['United States', 'Mexico']}
      country="Mexico"
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
