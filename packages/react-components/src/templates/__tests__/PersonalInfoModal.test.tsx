import { createUserResponse } from '@asap-hub/fixtures';
import { fireEvent } from '@testing-library/dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom/server';
import PersonalInfoModal from '../PersonalInfoModal';

const props: ComponentProps<typeof PersonalInfoModal> = {
  ...createUserResponse(),
  countrySuggestions: [],
  loadInstitutionOptions: () => Promise.resolve([]),
  backHref: '/wrong',
};

const renderModal = (children: React.ReactNode) =>
  render(<StaticRouter location="/">{children}</StaticRouter>);

it.skip('renders the title', async () => {
  // Suppress expected console.error for async state updates after test completion
  // TODO: Figure out how to avoid this console mock
  const errorSpy = jest.spyOn(console, 'error').mockImplementation();
  renderModal(
    <PersonalInfoModal
      {...props}
      loadInstitutionOptions={() => Promise.resolve([])}
      backHref="/wrong"
    />,
  );
  await waitFor(() => {
    expect(screen.getByText('Main details', { selector: 'h3' })).toBeVisible();
  });
  errorSpy.mockRestore();
});

it.skip('indicates which fields are required or optional', async () => {
  // Suppress expected console.error for async state updates after test completion
  // TODO: Figure out how to avoid this console mock
  const errorSpy = jest.spyOn(console, 'error').mockImplementation();
  renderModal(
    <PersonalInfoModal
      countrySuggestions={[]}
      loadInstitutionOptions={() => Promise.resolve([])}
      backHref="/wrong"
    />,
  );

  await waitFor(() => {
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
  errorSpy.mockRestore();
});

it('renders default values into text inputs', async () => {
  // Suppress expected console.error for async state updates after test completion
  // TODO: Figure out how to avoid this console mock
  const errorSpy = jest.spyOn(console, 'error').mockImplementation();
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
  await waitFor(() => {
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
  errorSpy.mockRestore();
});

it('renders a country selector', async () => {
  renderModal(
    <PersonalInfoModal
      {...props}
      countrySuggestions={['United States', 'Mexico']}
      country=""
    />,
  );

  await userEvent.click(screen.getByText('Start Typing...'));
  expect(screen.queryByText('United States')).toBeVisible();
  expect(screen.queryByText('Mexico')).toBeVisible();

  await userEvent.click(screen.getByText('Start Typing...'));
  await userEvent.type(screen.getByText('Start Typing...'), 'xx');
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
  await userEvent.click(field);
  await userEvent.tab();

  await userEvent.click(screen.getByRole('button', { name: /save/i }));
  expect(await screen.findByText(/Please add your country/i)).toBeVisible();
  await waitFor(() =>
    expect(screen.getByText(/save/i).closest('button')).toBeEnabled(),
  );
});

it.skip.each`
  label                 | message
  ${/city/i}            | ${'Please add your city'}
  ${/state\/province/i} | ${'Please add your state/province'}
  ${/institution/i}     | ${'Please add your institution'}
  ${/position/i}        | ${'Please add your position'}
`(
  'shows validation message $message when value set to $value on $label',
  async ({ label, message }) => {
    // Suppress expected console.error for async state updates after test completion
    // TODO: Figure out how to avoid this console mock
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

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

    await userEvent.click(screen.getByText(/save/i));
    expect(await screen.findByText(new RegExp(message, 'i'))).toBeVisible();
    errorSpy.mockRestore();
  },
);

it.skip('disables the form elements while submitting', async () => {
  // Suppress expected react-router warning about navigate() being called outside useEffect
  // TODO: Figure out how to avoid this console mock
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
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

  await userEvent.click(screen.getByText(/save/i));

  const form = screen.getByText(/save/i).closest('form')!;
  expect(form.elements.length).toBeGreaterThan(1);
  [...form.elements].forEach((element) => expect(element).toBeDisabled());

  act(resolveSubmit);
  await waitFor(() =>
    expect(screen.getByText(/save/i).closest('button')).toBeEnabled(),
  );
  warnSpy.mockRestore();
});
it.skip('triggers the save function', async () => {
  // Suppress expected react-router warning about navigate() being called outside useEffect
  // TODO: Figure out how to avoid this console mock
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
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

  await userEvent.click(screen.getByText('Save'));
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
  warnSpy.mockRestore();
});
