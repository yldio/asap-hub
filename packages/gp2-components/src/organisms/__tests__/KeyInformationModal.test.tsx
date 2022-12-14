import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import KeyInformationModal from '../KeyInformationModal';

describe('KeyInformatiomModal', () => {
  const defaultProps = {
    ...gp2Fixtures.createUserResponse(),
    locationSuggestions: [],
    loadInstitutionOptions: () => Promise.resolve([]),
    backHref: '',
    onSave: jest.fn(),
  };
  it('renders a dialog with the right title', () => {
    render(<KeyInformationModal {...defaultProps} />, {
      wrapper: MemoryRouter,
    });
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Key Information' }),
    );
  });
  it('renders the firstName and lastName fields', () => {
    render(<KeyInformationModal {...defaultProps} />, {
      wrapper: MemoryRouter,
    });
    expect(
      screen.getByRole('textbox', { name: 'First Name (required)' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Last Name (required)' }),
    ).toBeVisible();
  });
  it('calls onSave with the right arguments', async () => {
    const onSave = jest.fn();
    render(
      <KeyInformationModal
        {...defaultProps}
        firstName="Gonçalo"
        lastName="Ramos"
        degrees={['PhD']}
        positions={[
          { institution: 'FPF', department: "Men's Team", role: 'Striker' },
        ]}
        country="Portugal"
        city="Lisbon"
        region="Europe"
        onSave={onSave}
      />,
      {
        wrapper: MemoryRouter,
      },
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });
    userEvent.click(saveButton);
    expect(onSave).toHaveBeenCalledWith({
      firstName: 'Gonçalo',
      lastName: 'Ramos',
      degrees: ['PhD'],
      positions: [
        { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      ],
      country: 'Portugal',
      city: 'Lisbon',
      region: 'Europe',
    });
    await waitFor(() => expect(saveButton).toBeEnabled());
  });
  it('calls onSave with the updated fields', async () => {
    const onSave = jest.fn();
    render(
      <KeyInformationModal
        {...defaultProps}
        firstName=""
        lastName=""
        degrees={[]}
        positions={[]}
        country=""
        city=""
        region="Asia"
        locationSuggestions={['Portugal']}
        loadInstitutionOptions={() => Promise.resolve(['FPF'])}
        onSave={onSave}
      />,
      {
        wrapper: MemoryRouter,
      },
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'First Name (required)' }),
      'Gonçalo',
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'Last Name (required)' }),
      'Ramos',
    );
    userEvent.click(screen.getByRole('textbox', { name: 'Degree (optional)' }));
    userEvent.click(screen.getByText('PhD'));
    userEvent.click(
      screen.getByRole('textbox', {
        name: 'Region (required) Select the region you are based in.',
      }),
    );
    userEvent.click(screen.getByText('Europe'));
    userEvent.click(
      screen.getByRole('textbox', {
        name: 'Location (required) Select the location you are based in.',
      }),
    );
    userEvent.click(screen.getByText('Portugal'));
    userEvent.type(
      screen.getByRole('textbox', { name: 'City (optional)' }),
      'Lisbon',
    );
    userEvent.click(
      screen.getByRole('textbox', { name: 'Primary Institution (required)' }),
    );
    const institution = await screen.findByText('FPF');
    userEvent.click(institution);
    userEvent.type(
      screen.getByRole('textbox', { name: 'Primary Department (required)' }),
      "Men's Team",
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'Primary Role (required)' }),
      'Striker',
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });
    userEvent.click(saveButton);
    expect(onSave).toHaveBeenCalledWith({
      firstName: 'Gonçalo',
      lastName: 'Ramos',
      degrees: ['PhD'],
      positions: [
        { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      ],
      country: 'Portugal',
      city: 'Lisbon',
      region: 'Europe',
    });
    await waitFor(() => expect(saveButton).toBeEnabled());
  }, 10000);
  test('can click add an extra position', () => {
    render(
      <KeyInformationModal
        {...defaultProps}
        firstName="Gonçalo"
        lastName="Ramos"
        degrees={['PhD']}
        positions={[
          { institution: 'FPF', department: "Men's Team", role: 'Striker' },
        ]}
        country="Portugal"
        city="Lisbon"
        region="Europe"
        onSave={jest.fn()}
      />,
      {
        wrapper: MemoryRouter,
      },
    );
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
  test.todo('can save an extra position');
  test.todo('can delete an extra position');
  test.todo('there can be only 3 positions');
  test.todo('there is a minimum of one');
});
