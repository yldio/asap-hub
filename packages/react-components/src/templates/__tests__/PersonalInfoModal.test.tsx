import { createUserResponse } from '@asap-hub/fixtures';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router';
import { mockActErrorsInConsole } from '../../test-utils';
import PersonalInfoModal from '../PersonalInfoModal';

const props: ComponentProps<typeof PersonalInfoModal> = {
  ...createUserResponse(),
  countrySuggestions: [],
  loadInstitutionOptions: () => Promise.resolve([]),
  backHref: '/wrong',
};

const renderModal = (children: React.ReactNode) =>
  render(<MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>);

it('renders the title', async () => {
  renderModal(
    <PersonalInfoModal
      {...props}
      loadInstitutionOptions={() => Promise.resolve([])}
      backHref="/wrong"
    />,
  );
  expect(
    await screen.findByText('Main details', { selector: 'h3' }),
  ).toBeVisible();
});

it('indicates which fields are required or optional', async () => {
  renderModal(
    <PersonalInfoModal
      countrySuggestions={[]}
      loadInstitutionOptions={() => Promise.resolve([])}
      backHref="/wrong"
    />,
  );

  // Wait for the form to be fully rendered
  await screen.findByText('First name');

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

it('renders default values into text inputs', async () => {
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

  // Wait for the form to be fully rendered
  await screen.findByDisplayValue('firstName');

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
      "New York",
      "city",
    ]
  `);
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
  // Suppress act() warnings from async validation state updates
  const consoleMock = mockActErrorsInConsole();

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

  // In react-select v5, select inputs use role="combobox" instead of "textbox"
  const field = screen.getByRole('combobox', { name: /country/i });
  await userEvent.click(field);
  await userEvent.tab();

  await userEvent.click(screen.getByRole('button', { name: /save/i }));
  expect(await screen.findByText(/Please add your country/i)).toBeVisible();
  await waitFor(() =>
    expect(screen.getByText(/save/i).closest('button')).toBeEnabled(),
  );

  consoleMock.mockRestore();
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
    // Suppress act() warnings from async validation state updates triggered by blur
    const consoleMock = mockActErrorsInConsole();

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

    // Wait for form to be fully rendered
    await screen.findByLabelText(label);

    const field = screen.getByLabelText(label);
    const input = (field.closest('input') || field) as HTMLInputElement;

    // Use userEvent.clear instead of fireEvent.change for proper act() wrapping
    await userEvent.clear(input);
    expect(input).toHaveValue('');

    await userEvent.click(screen.getByText(/save/i));
    expect(await screen.findByText(new RegExp(message, 'i'))).toBeVisible();

    consoleMock.mockRestore();
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

  await userEvent.click(screen.getByText(/save/i));

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
});

describe('profile photo', () => {
  beforeAll(() => {
    URL.createObjectURL = jest.fn(() => 'blob:preview');
    URL.revokeObjectURL = jest.fn();
  });

  const renderWithAvatar = (
    overrides: Partial<ComponentProps<typeof PersonalInfoModal>> = {},
  ) => {
    const onImageSelect = jest.fn();
    const onImageRemove = jest.fn();
    const onSave = jest.fn();
    renderModal(
      <PersonalInfoModal
        {...props}
        onImageSelect={onImageSelect}
        onImageRemove={onImageRemove}
        onSave={onSave}
        {...overrides}
      />,
    );
    return { onImageSelect, onImageRemove, onSave };
  };

  it('is not shown when no image handlers are provided', async () => {
    renderModal(<PersonalInfoModal {...props} />);
    await screen.findByText('First name');
    expect(screen.queryByText(/profile photo/i)).not.toBeInTheDocument();
  });

  it('stages an upload as a preview without committing it', async () => {
    const { onImageSelect } = renderWithAvatar();
    const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });

    await userEvent.upload(
      screen.getByLabelText(/upload profile photo/i, { selector: 'input' }),
      file,
    );

    // the chosen image is previewed but not yet uploaded
    expect(screen.getByLabelText(/profile picture/i)).toHaveStyle({
      backgroundImage: `url(blob:preview)`,
    });
    expect(onImageSelect).not.toHaveBeenCalled();
  });

  it('commits a staged upload only when the form is saved', async () => {
    const { onImageSelect, onSave } = renderWithAvatar();
    const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });

    await userEvent.upload(
      screen.getByLabelText(/upload profile photo/i, { selector: 'input' }),
      file,
    );
    await userEvent.click(screen.getByText(/save/i));

    expect(onImageSelect).toHaveBeenCalledWith(file);
    expect(onSave).toHaveBeenCalled();
  });

  it('stages a removal but only commits it on save', async () => {
    const { onImageRemove } = renderWithAvatar({
      avatarUrl: 'https://example.com/a.png',
    });

    await userEvent.click(screen.getByRole('button', { name: /remove/i }));

    // remove button disappears because there is no longer a previewed avatar
    expect(
      screen.queryByRole('button', { name: /remove/i }),
    ).not.toBeInTheDocument();
    expect(onImageRemove).not.toHaveBeenCalled();

    await userEvent.click(screen.getByText(/save/i));
    expect(onImageRemove).toHaveBeenCalled();
  });

  it('does not commit avatar changes when cancelled', async () => {
    const { onImageSelect, onImageRemove } = renderWithAvatar({
      avatarUrl: 'https://example.com/a.png',
    });
    const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });

    await userEvent.upload(
      screen.getByLabelText(/upload profile photo/i, { selector: 'input' }),
      file,
    );
    await userEvent.click(screen.getByText(/cancel/i));

    expect(onImageSelect).not.toHaveBeenCalled();
    expect(onImageRemove).not.toHaveBeenCalled();
  });

  it('commits only the latest staged change when removed then re-uploaded', async () => {
    const { onImageSelect, onImageRemove } = renderWithAvatar({
      avatarUrl: 'https://example.com/a.png',
    });
    const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });

    // remove the existing photo...
    await userEvent.click(screen.getByRole('button', { name: /remove/i }));
    // ...then change your mind and upload a new one before saving
    await userEvent.upload(
      screen.getByLabelText(/upload profile photo/i, { selector: 'input' }),
      file,
    );
    await userEvent.click(screen.getByText(/save/i));

    // only the final staged upload is committed, not the intermediate removal
    expect(onImageSelect).toHaveBeenCalledWith(file);
    expect(onImageRemove).not.toHaveBeenCalled();
  });
});
