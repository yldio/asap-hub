import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import UserPositions from '../UserPositions';

describe('UserPositions', () => {
  const getAddButton = () =>
    screen.getByRole('button', {
      name: /add another institution/i,
    });
  beforeEach(jest.resetAllMocks);
  type UserPositionsProps = ComponentProps<typeof UserPositions>;
  const defaultProps: UserPositionsProps = {
    onChange: jest.fn(),
    loadInstitutionOptions: () => Promise.resolve([]),
    isSaving: false,
    positions: [],
  };

  const renderUserPositions = (overrides: Partial<UserPositionsProps> = {}) =>
    render(<UserPositions {...defaultProps} {...overrides} />, {
      wrapper: MemoryRouter,
    });

  it('renders a dialog with the right title', () => {
    renderUserPositions({
      positions: [
        { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      ],
    });
    expect(
      screen.getByRole('textbox', { name: 'Primary Institution (required)' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Primary Department (required)' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Primary Role (required)' }),
    ).toBeVisible();
  });

  it('can click add an extra position', () => {
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
    ];
    const onChange = jest.fn();
    renderUserPositions({
      positions,
      onChange,
    });
    const addButton = getAddButton();
    userEvent.click(addButton);
    expect(onChange).toBeCalledWith([
      ...positions,
      { institution: '', department: '', role: '' },
    ]);
  });

  it('there can be only 3 positions', () => {
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      { institution: 'Benfica', department: 'First Team', role: 'Forward' },
      { institution: 'Olhanense', department: 'Youth Team', role: 'Attacker' },
    ];
    renderUserPositions({
      positions,
    });
    expect(
      screen.queryByRole('button', {
        name: /add another institution/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('can save a position institution', async () => {
    const onChange = jest.fn();
    const position = {
      institution: 'A',
      department: '',
      role: '',
    };
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      { institution: '', department: '', role: '' },
    ];
    renderUserPositions({
      positions,
      onChange,
      loadInstitutionOptions: () => Promise.resolve([position.institution]),
    });
    userEvent.click(
      screen.getByRole('textbox', { name: /Secondary Institution/i }),
    );
    const institution = await screen.findByText(position.institution);
    userEvent.click(institution);

    expect(onChange).toHaveBeenCalledWith([positions[0], position]);
  });
  it('can save a position department', async () => {
    const onChange = jest.fn();
    const position = {
      institution: '',
      department: 'A',
      role: '',
    };
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      { institution: '', department: '', role: '' },
    ];
    renderUserPositions({
      positions,
      onChange,
    });
    userEvent.type(
      screen.getByRole('textbox', { name: /Secondary Department/i }),
      position.department,
    );

    expect(onChange).toHaveBeenCalledWith([positions[0], position]);
  });
  it('can save a position role', async () => {
    const onChange = jest.fn();
    const position = {
      institution: '',
      department: '',
      role: 'A',
    };
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      { institution: '', department: '', role: '' },
    ];
    renderUserPositions({
      positions,
      onChange,
    });
    userEvent.type(
      screen.getByRole('textbox', { name: /Secondary Role/i }),
      position.role,
    );

    expect(onChange).toHaveBeenCalledWith([positions[0], position]);
  });
});
