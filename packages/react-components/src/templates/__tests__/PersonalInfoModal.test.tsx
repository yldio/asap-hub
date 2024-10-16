import { createUserResponse } from '@asap-hub/fixtures';
import { fireEvent } from '@testing-library/dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
import PersonalInfoModal from '../PersonalInfoModal';

const props: ComponentProps<typeof PersonalInfoModal> = {
  ...createUserResponse(),
  countrySuggestions: [],
  loadInstitutionOptions: () => Promise.resolve([]),
  backHref: '/wrong',
};

const renderModal = (children: React.ReactNode) =>
  render(<StaticRouter>{children}</StaticRouter>);

it('renders the title', () => {
  renderModal(
    <PersonalInfoModal
      {...props}
      loadInstitutionOptions={() => Promise.resolve([])}
      backHref="/wrong"
    />,
  );
  expect(screen.getByText('Main details', { selector: 'h3' })).toBeVisible();
});

it('indicates which fields are required or optional', () => {
  renderModal(
    <PersonalInfoModal
      countrySuggestions={[]}
      loadInstitutionOptions={() => Promise.resolve([])}
      backHref="/wrong"
    />,
  );

  [
    { title: 'First name', subtitle: 'required' },
    { title: 'Middle name(s)', subtitle: 'optional' },
    { title: 'Last name(s)', subtitle: 'required' },
    { title: 'Nickname', subtitle: 'optional' },
    { title: 'Degree', subtitle: 'optional' },
    { title: 'Institution', subtitle: 'required' },
    { title: 'Position', subtitle: 'required' },
    { title: 'Country', subtitle: 'required' },
    { title: 'City', subtitle: 'required' },
  ].forEach(({ title, subtitle }) =>
    expect(screen.getByText(title).nextSibling?.textContent).toContain(
      subtitle,
    ),
  );
});

it('renders default values into text inputs', () => {
  renderModal(
    <PersonalInfoModal
      {...props}
      countrySuggestions={['United States', 'Mexico']}
      firstName="firstName"
      middleName="middleName"
      lastName="lastName"
      nickname="nickname"
      country="United States"
      stateOrProvince="New York"
      city="city"
      jobTitle="jobTitle"
      institution="institution"
    />,
  );
  expect(
    screen
      .queryAllByRole('textbox')
      .map((input) => input.getAttribute('value')),
  ).toMatchInlineSnapshot(`
    [
      "firstName",
      "middleName",
      "lastName",
      "nickname",
      "",
      "institution",
      "jobTitle",
      "",
      "New York",
      "city",
    ]
  `);
});

it('renders a country selector', () => {
  renderModal(
    <PersonalInfoModal
      {...props}
      countrySuggestions={['United States', 'Mexico']}
      country=""
    />,
  );

  userEvent.click(screen.getByText('Start Typing...'));
  expect(screen.queryByText('United States')).toBeVisible();
  expect(screen.queryByText('Mexico')).toBeVisible();

  userEvent.click(screen.getByText('Start Typing...'));
  userEvent.type(screen.getByText('Start Typing...'), 'xx');
  expect(screen.queryByText(/no+countries/i)).toBeDefined();
});
it('shows validation message country when it not selected', async () => {
  renderModal(
    <PersonalInfoModal
      {...props}
      country=""
      countrySuggestions={[]}
      institution="UCM"
      city="Madrid"
      jobTitle="Assistant Professor"
    />,
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
  label                 | message
  ${/city/i}            | ${'Please add your city'}
  ${/state\/province/i} | ${'Please add your state/province'}
  ${/institution/i}     | ${'Please add your institution'}
  ${/position/i}        | ${'Please add your position'}
`(
  'shows validation message $message when value set to $value on $label',
  async ({ label, message }) => {
    renderModal(
      <PersonalInfoModal
        {...props}
        country="Spain"
        countrySuggestions={['Spain']}
        institution="UCM"
        city="Madrid"
        jobTitle="Assistant Professor"
      />,
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
  renderModal(
    <PersonalInfoModal
      {...props}
      onSave={handleSave}
      countrySuggestions={['United States', 'Mexico']}
      stateOrProvince="Yucatán"
      country="Mexico"
    />,
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
  renderModal(
    <PersonalInfoModal
      {...props}
      countrySuggestions={['United States', 'Mexico']}
      firstName="firstName"
      middleName="middleName"
      lastName="lastName"
      nickname="nickname"
      country="United States"
      stateOrProvince="New York"
      city="city"
      jobTitle="jobTitle"
      institution="institution"
      degree="MPH"
      onSave={jestFn}
    />,
  );

  userEvent.click(screen.getByText('Save'));
  expect(jestFn).toHaveBeenCalledWith({
    firstName: 'firstName',
    middleName: 'middleName',
    lastName: 'lastName',
    nickname: 'nickname',
    country: 'United States',
    city: 'city',
    degree: 'MPH',
    jobTitle: 'jobTitle',
    institution: 'institution',
    stateOrProvince: 'New York',
  });

  await waitFor(() =>
    expect(screen.getByText(/save/i).closest('button')).toBeEnabled(),
  );
});
