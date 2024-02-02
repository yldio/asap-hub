import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import KeyInformationModal from '../KeyInformationModal';

describe('KeyInformationModal', () => {
  const getSaveButton = () => screen.getByRole('button', { name: 'Save' });
  const getAddButton = () =>
    screen.getByRole('button', {
      name: /add another position/i,
    });
  beforeEach(jest.resetAllMocks);
  type KeyInformationModalProps = ComponentProps<typeof KeyInformationModal>;
  const defaultProps: KeyInformationModalProps = {
    ...gp2Fixtures.createUserResponse(),
    locationSuggestions: [],
    loadInstitutionOptions: jest.fn().mockResolvedValue([]),
    backHref: '',
    onSave: jest.fn(),
  };

  const renderKeyInformation = (
    overrides: Partial<KeyInformationModalProps> = {},
  ) =>
    render(<KeyInformationModal {...defaultProps} {...overrides} />, {
      wrapper: MemoryRouter,
    });

  it('renders a dialog with the right title', () => {
    renderKeyInformation();
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Key Information' }),
    );
  });

  it('renders the firstName and lastName fields', () => {
    renderKeyInformation();
    expect(
      screen.getByRole('textbox', { name: 'First Name (required)' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Last Name (required)' }),
    ).toBeVisible();
  });

  it('calls onSave with the right arguments', async () => {
    const onSave = jest.fn();
    const firstName = 'Gonçalo';
    const middleName = 'Matias';
    const lastName = 'Ramos';
    const nickname = 'Pistoleiro';
    const degrees: KeyInformationModalProps['degrees'] = ['PhD'];
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
    ];
    const country = 'Portugal';
    const city = 'Lisbon';
    const region = 'Europe';
    renderKeyInformation({
      firstName,
      middleName,
      lastName,
      nickname,
      degrees,
      positions,
      country,
      city,
      region,
      onSave,
    });
    userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      firstName,
      middleName,
      lastName,
      nickname,
      degrees,
      positions,
      country,
      city,
      region,
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  it('shows validation message when city is not provided', async () => {
    const onSave = jest.fn();
    renderKeyInformation({
      city: '',
      onSave,
    });
    userEvent.click(screen.getByRole('textbox', { name: /city/i }));
    userEvent.tab();
    expect(screen.getByText(/Please add your city/i)).toBeVisible();
  });

  it('calls onSave with the updated fields', async () => {
    const firstName = 'Gonçalo';
    const middleName = 'Matias';
    const lastName = 'Ramos';
    const nickname = 'Pistoleiro';
    const degrees: KeyInformationModalProps['degrees'] = ['PhD'];
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
    ];
    const country = 'Portugal';
    const city = 'Lisbon';
    const region = 'Europe';
    const onSave = jest.fn();
    renderKeyInformation({
      firstName: '',
      middleName: '',
      lastName: '',
      nickname: '',
      degrees: [],
      positions: [],
      country: '',
      city: '',
      region: 'Asia',
      onSave,
      locationSuggestions: ['Portugal'],
      loadInstitutionOptions: jest
        .fn()
        .mockResolvedValue([positions[0]!.institution]),
    });
    userEvent.type(
      screen.getByRole('textbox', { name: 'First Name (required)' }),
      firstName,
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'Middle Name(s) (optional)' }),
      middleName,
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'Last Name (required)' }),
      lastName,
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'Nickname (optional)' }),
      nickname,
    );
    userEvent.click(screen.getByRole('textbox', { name: 'Degree (required)' }));
    userEvent.click(screen.getByText(degrees[0]!));
    userEvent.click(
      screen.getByRole('textbox', {
        name: 'Region (required) Select the region you are based in.',
      }),
    );
    userEvent.click(screen.getByText(region));
    userEvent.click(
      screen.getByRole('textbox', {
        name: 'Location (required) Select the location you are based in.',
      }),
    );
    userEvent.click(screen.getByText(country));
    userEvent.type(
      screen.getByRole('textbox', { name: 'City (required)' }),
      city,
    );
    userEvent.click(
      screen.getByRole('textbox', { name: 'Institution (required)' }),
    );
    const institution = await screen.findByText(positions[0]!.institution);
    userEvent.click(institution);
    userEvent.type(
      screen.getByRole('textbox', { name: 'Department (required)' }),
      positions[0]!.department,
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'Role (required)' }),
      positions[0]!.role,
    );
    const saveButton = getSaveButton();
    userEvent.click(saveButton);
    expect(onSave).toHaveBeenCalledWith({
      firstName,
      middleName,
      lastName,
      nickname,
      degrees,
      positions,
      country,
      city,
      region,
    });
    await waitFor(() => expect(saveButton).toBeEnabled());
  }, 60000);

  it('can click add an extra position', () => {
    renderKeyInformation();
    const addButton = getAddButton();
    userEvent.click(addButton);
    const secondary = screen.getByRole('heading', {
      name: /Secondary Position/i,
    }).parentElement?.parentElement as HTMLElement;
    expect(
      within(secondary).getByRole('textbox', {
        name: /Institution/i,
      }),
    ).toBeVisible();
    userEvent.click(addButton);
    const tertiary = screen.getByRole('heading', {
      name: /Tertiary Position/i,
    }).parentElement?.parentElement as HTMLElement;
    expect(
      within(tertiary).getByRole('textbox', {
        name: /Institution/i,
      }),
    ).toBeVisible();
  });

  it('there can be only 3 positions', () => {
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      { institution: 'Benfica', department: 'First Team', role: 'Forward' },
      { institution: 'Olhanense', department: 'Youth Team', role: 'Attacker' },
    ];
    renderKeyInformation({
      positions,
    });
    expect(
      screen.queryByRole('button', {
        name: /add another position/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('can save an extra position', async () => {
    const onSave = jest.fn();
    const position = {
      institution: 'Olhanense',
      department: 'Youth Team',
      role: 'Attacker',
    };
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      { institution: 'Benfica', department: 'First Team', role: 'Forward' },
    ];
    renderKeyInformation({
      positions,
      onSave,
      loadInstitutionOptions: jest
        .fn()
        .mockResolvedValue([position.institution]),
    });
    userEvent.click(getAddButton());

    const tertiary = screen.getByRole('heading', {
      name: /Tertiary Position/i,
    }).parentElement?.parentElement as HTMLElement;

    userEvent.click(
      within(tertiary).getByRole('textbox', { name: /Institution/i }),
    );
    const institution = await screen.findByText(position.institution);
    userEvent.click(institution);
    userEvent.type(
      within(tertiary).getByRole('textbox', { name: /Department/i }),
      position.department,
    );
    userEvent.type(
      within(tertiary).getByRole('textbox', { name: /Role/i }),
      position.role,
    );
    const saveButton = getSaveButton();
    userEvent.click(saveButton);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ positions: [...positions, position] }),
    );
    await waitFor(() => expect(saveButton).toBeEnabled());
  }, 30000);
});
