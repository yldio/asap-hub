import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
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
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
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
    await userEvent.type(
      screen.getByRole('textbox', { name: 'First Name (required)' }),
      'Gonçalo',
    );
    await userEvent.type(
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
    await userEvent.type(
      screen.getByRole('textbox', { name: 'City (optional)' }),
      'Lisbon',
    );
    userEvent.click(
      screen.getByRole('textbox', { name: 'Primary Institution (required)' }),
    );
    userEvent.click(screen.getByText('FPF'));
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Primary Department (required)' }),
      "Men's Team",
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Primary Role (required)' }),
      'Striker',
    );
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
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
  });
});
