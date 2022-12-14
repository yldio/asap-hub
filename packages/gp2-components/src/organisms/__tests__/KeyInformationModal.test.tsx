import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import KeyInformationModal from '../KeyInformationModal';

describe('KeyInformatiomModal', () => {
  type KeyInformationModalProps = ComponentProps<typeof KeyInformationModal>;
  const defaultProps: KeyInformationModalProps = {
    ...gp2Fixtures.createUserResponse(),
    locationSuggestions: [],
    loadInstitutionOptions: () => Promise.resolve([]),
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
    const lastName = 'Ramos';
    const degrees: KeyInformationModalProps['degrees'] = ['PhD'];
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
    ];
    const country = 'Portugal';
    const city = 'Lisbon';
    const region = 'Europe';
    renderKeyInformation({
      firstName,
      lastName,
      degrees,
      positions,
      country,
      city,
      region,
      onSave,
    });
    const saveButton = screen.getByRole('button', { name: 'Save' });
    userEvent.click(saveButton);
    expect(onSave).toHaveBeenCalledWith({
      firstName,
      lastName,
      degrees,
      positions,
      country,
      city,
      region,
    });
    await waitFor(() => expect(saveButton).toBeEnabled());
  });
  it('calls onSave with the updated fields', async () => {
    const firstName = 'Gonçalo';
    const lastName = 'Ramos';
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
      lastName: '',
      degrees: [],
      positions: [],
      country: '',
      city: '',
      region: 'Asia',
      onSave,
      locationSuggestions: ['Portugal'],
      loadInstitutionOptions: () => Promise.resolve(['FPF']),
    });
    userEvent.type(
      screen.getByRole('textbox', { name: 'First Name (required)' }),
      firstName,
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'Last Name (required)' }),
      lastName,
    );
    userEvent.click(screen.getByRole('textbox', { name: 'Degree (optional)' }));
    userEvent.click(screen.getByText(degrees[0]));
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
      screen.getByRole('textbox', { name: 'City (optional)' }),
      city,
    );
    userEvent.click(
      screen.getByRole('textbox', { name: 'Primary Institution (required)' }),
    );
    const institution = await screen.findByText(positions[0].institution);
    userEvent.click(institution);
    userEvent.type(
      screen.getByRole('textbox', { name: 'Primary Department (required)' }),
      positions[0].department,
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'Primary Role (required)' }),
      positions[0].role,
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });
    userEvent.click(saveButton);
    expect(onSave).toHaveBeenCalledWith({
      firstName,
      lastName,
      degrees,
      positions,
      country,
      city,
      region,
    });
    await waitFor(() => expect(saveButton).toBeEnabled());
  }, 10000);
  test('can click add an extra position', () => {
    renderKeyInformation();
    const addButton = screen.getByRole('button', {
      name: /add another institution/i,
    });
    userEvent.click(addButton);
    expect(
      screen.getByRole('textbox', { name: 'Secondary Institution (required)' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Secondary Department (required)' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Secondary Role (required)' }),
    ).toBeVisible();
    userEvent.click(addButton);
    expect(
      screen.getByRole('textbox', { name: 'Other Institution (required)' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Other Department (required)' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Other Role (required)' }),
    ).toBeVisible();
  });
  test.todo('there can be only 3 positions');
  test.todo('can save an extra position');
  test.todo('can delete an extra position');
  test.todo('there is a minimum of one');
  test.todo('is there an add icon');
});
