import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import UserPositions from '../UserPositions';

describe('UserPositions', () => {
  const getAddButton = () =>
    screen.getByRole('button', {
      name: /add another position/i,
    });
  beforeEach(jest.resetAllMocks);
  type UserPositionsProps = ComponentProps<typeof UserPositions>;
  const defaultProps: UserPositionsProps = {
    onChange: jest.fn(),
    loadInstitutionOptions: jest.fn().mockResolvedValue([]),
    isSaving: false,
    positions: [],
  };

  const renderUserPositions = (overrides: Partial<UserPositionsProps> = {}) =>
    render(<UserPositions {...defaultProps} {...overrides} />, {
      wrapper: MemoryRouter,
    });

  it('renders a dialog with the right title', () => {
    jest.spyOn(console, 'error').mockImplementation();
    renderUserPositions({
      positions: [
        { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      ],
    });
    expect(
      screen.getByRole('heading', { name: 'Primary Position' }),
    ).toBeVisible();
    expect(
      screen.getByRole('combobox', { name: 'Institution (required)' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Department (required)' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Role (required)' }),
    ).toBeVisible();
  });

  it('can click add an extra position', async () => {
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
    ];
    const onChange = jest.fn();
    renderUserPositions({
      positions,
      onChange,
    });
    const addButton = getAddButton();
    await userEvent.click(addButton);
    expect(onChange).toHaveBeenCalledWith([
      ...positions,
      { institution: '', department: '', role: '' },
    ]);
  });

  it('there can be only 3 positions', () => {
    jest.spyOn(console, 'error').mockImplementation();
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
        name: /add another position/i,
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
      loadInstitutionOptions: jest
        .fn()
        .mockResolvedValue([position.institution]),
    });
    const secondary = screen.getByRole('heading', {
      name: /Secondary Position/i,
    }).parentElement?.parentElement as HTMLElement;

    await userEvent.click(
      within(secondary).getByRole('combobox', {
        name: /Institution/i,
      }),
    );
    const institution = await screen.findByText(position.institution);
    await userEvent.click(institution);

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
    const secondary = screen.getByRole('heading', {
      name: /Secondary Position/i,
    }).parentElement?.parentElement as HTMLElement;
    await userEvent.type(
      within(secondary).getByRole('textbox', { name: /Department/i }),
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
    const secondary = screen.getByRole('heading', {
      name: /Secondary Position/i,
    }).parentElement?.parentElement as HTMLElement;
    await userEvent.type(
      within(secondary).getByRole('textbox', { name: /Role/i }),
      position.role,
    );

    expect(onChange).toHaveBeenCalledWith([positions[0], position]);
  });

  it('can delete a position', async () => {
    const onChange = jest.fn();
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      { institution: 'Benfica', department: 'First Team', role: 'Forward' },
    ];
    renderUserPositions({
      positions,
      onChange,
    });
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);
    expect(onChange).toHaveBeenCalledWith([positions[0]]);
  });
});
