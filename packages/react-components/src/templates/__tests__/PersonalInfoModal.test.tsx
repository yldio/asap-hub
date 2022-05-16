import { createUserResponse } from '@asap-hub/fixtures';
import { fireEvent } from '@testing-library/dom';
import { act, render, screen, waitFor } from '@testing-library/react';
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
  render(
    <PersonalInfoModal
      {...props}
      loadInstitutionOptions={() => Promise.resolve([])}
      backHref="/wrong"
    />,
    {
      wrapper: StaticRouter,
    },
  );
  expect(screen.getByText('Your details', { selector: 'h3' })).toBeVisible();
});

it('indicates which fields are required or optional', () => {
  render(
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
    expect(screen.getByText(title).nextSibling?.textContent).toContain(
      subtitle,
    ),
  );
});

it('renders default values into text inputs', () => {
  render(
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
  expect(
    screen
      .queryAllByRole('textbox')
      .map((input) => input.getAttribute('value')),
  ).toMatchInlineSnapshot(`
    Array [
      "firstName",
      "lastName",
      "",
      "institution",
      "jobTitle",
      "",
      "city",
    ]
  `);
});

it('renders a country selector', () => {
  render(
    <PersonalInfoModal
      {...props}
      countrySuggestions={['United States', 'Mexico']}
      country=""
    />,
    {
      wrapper: StaticRouter,
    },
  );

  userEvent.click(screen.getByText('Start Typing...'));
  expect(screen.queryByText('United States')).toBeVisible();
  expect(screen.queryByText('Mexico')).toBeVisible();

  userEvent.click(screen.getByText('Start Typing...'));
  userEvent.type(screen.getByText('Start Typing...'), 'xx');
  expect(screen.queryByText(new RegExp(/no+countries/, 'i'))).toBeDefined();
});
it('shows validation message country when it not selected', async () => {
  render(
    <PersonalInfoModal
      {...props}
      country=""
      countrySuggestions={[]}
      institution="UCM"
      city="Madrid"
      jobTitle="Assistant Professor"
    />,
    {
      wrapper: StaticRouter,
    },
  );
  const field = screen.getByRole('textbox', { name: /country/i });
  userEvent.click(field);
  userEvent.tab();

  userEvent.click(screen.getByRole('button', { name: /save/i }));
  expect(await screen.findByText(/Please add your country/i)).toBeVisible();
  await waitFor(() =>
    expect(screen.getByText(/save/i).closest('button')).toBeEnabled(),
  );
});

it.each`
  label             | message
  ${/city/i}        | ${'Please add your city'}
  ${/institution/i} | ${'Please add your institution'}
  ${/position/i}    | ${'Please add your position'}
`(
  'shows validation message $message when value set to $value on $label',
  async ({ label, message }) => {
    render(
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
    const field = screen.getByLabelText(label);
    const input = field.closest('input') || field;

    fireEvent.change(input, { target: { value: '' } });
    expect(input).toHaveValue('');

    userEvent.click(screen.getByText(/save/i));
    expect(await screen.findByText(new RegExp(message, 'i'))).toBeVisible();
  },
);

it('disables the form elements while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  render(
    <PersonalInfoModal
      {...props}
      onSave={handleSave}
      countrySuggestions={['United States', 'Mexico']}
      country="Mexico"
    />,
    { wrapper: StaticRouter },
  );

  userEvent.click(screen.getByText(/save/i));

  const form = screen.getByText(/save/i).closest('form')!;
  expect(form.elements.length).toBeGreaterThan(1);
  [...form.elements].forEach((element) => expect(element).toBeDisabled());

  act(resolveSubmit);
  await waitFor(() =>
    expect(screen.getByText(/save/i).closest('button')).toBeEnabled(),
  );
});
it('triggers the save function', async () => {
  const jestFn = jest.fn();
  render(
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

  userEvent.click(screen.getByText('Save'));
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
    expect(screen.getByText(/save/i).closest('button')).toBeEnabled(),
  );
});
