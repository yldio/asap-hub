import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import UserPosition from '../UserPosition';

describe('UserPosition', () => {
  beforeEach(jest.resetAllMocks);
  type UserPositionProps = ComponentProps<typeof UserPosition>;
  const defaultProps: UserPositionProps = {
    onRemove: jest.fn(),
    onChange: jest.fn(),
    loadInstitutionOptions: () => Promise.resolve([]),
    isSaving: false,
    position: {
      institution: '',
      department: '',
      role: '',
    },
    index: 0,
  };

  const renderUserPosition = (overrides: Partial<UserPositionProps> = {}) =>
    render(<UserPosition {...defaultProps} {...overrides} />, {
      wrapper: MemoryRouter,
    });

  it('renders a dialog with the right position', () => {
    const position = {
      institution: 'FPF',
      department: "Men's Team",
      role: 'Striker',
    };
    renderUserPosition({
      position,
    });
    expect(
      screen.getByRole('textbox', { name: 'Institution (required)' }),
    ).toHaveValue(position.institution);
    expect(
      screen.getByRole('textbox', { name: 'Department (required)' }),
    ).toHaveValue(position.department);
    expect(
      screen.getByRole('textbox', { name: 'Role (required)' }),
    ).toHaveValue(position.role);
  });
  it('can save a position institution', async () => {
    const onChange = jest.fn();
    const institution = 'A';
    renderUserPosition({
      onChange,
      loadInstitutionOptions: () => Promise.resolve([institution]),
      index: 1,
    });
    userEvent.click(screen.getByRole('textbox', { name: /Institution/i }));
    const institutionBox = await screen.findByText(institution);
    userEvent.click(institutionBox);

    expect(onChange).toHaveBeenCalledWith({
      ...defaultProps.position,
      institution,
    });
  });
  it('can save a position department', async () => {
    const onChange = jest.fn();
    const department = 'A';
    renderUserPosition({
      onChange,
      index: 1,
      position: {
        institution: 'FPF',
        department: '',
        role: '',
      },
    });
    userEvent.type(
      screen.getByRole('textbox', { name: /Department/i }),
      department,
    );

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        department,
      }),
    );
  });
  it('can save a position role', async () => {
    const onChange = jest.fn();
    const role = 'A';
    renderUserPosition({
      onChange,
      index: 1,
      position: {
        institution: 'FPF',
        department: '',
        role: '',
      },
    });
    userEvent.type(screen.getByRole('textbox', { name: /Role/i }), role);

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ role }));
  });
  it.each`
    index | prefix
    ${0}  | ${'Primary'}
    ${1}  | ${'Secondary'}
    ${2}  | ${'Tertiary'}
  `('renders with the correct prefix for $index', ({ prefix, index }) => {
    renderUserPosition({
      index,
    });

    expect(
      screen.getByRole('heading', { name: `${prefix} Position` }),
    ).toBeVisible();
  });
  it('should not have a delete button if the index is 0', () => {
    const onRemove = jest.fn();
    renderUserPosition({ onRemove, index: 0 });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  it('should have a delete button if the index is not 0', () => {
    const onRemove = jest.fn();
    renderUserPosition({ onRemove, index: 1 });
    expect(screen.queryByRole('button')).toBeVisible();
  });
  it('can delete a position', () => {
    const onRemove = jest.fn();
    renderUserPosition({ onRemove, index: 2 });
    const removeButton = screen.getByRole('button');
    userEvent.click(removeButton);
    expect(onRemove).toBeCalled();
  });
  it('does not show the department and role when then institution is empty', () => {
    renderUserPosition({
      position: {
        institution: '',
        department: '',
        role: '',
      },
    });

    expect(
      screen.getByRole('textbox', { name: `Institution (required)` }),
    ).toBeVisible();
    expect(
      screen.queryByRole('textbox', { name: `Department (required)` }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: `Role (required)` }),
    ).not.toBeInTheDocument();
  });
  it('displays the role and the department when the institution has been selected', () => {
    renderUserPosition({
      position: {
        institution: 'FPF',
        department: '',
        role: '',
      },
    });

    expect(
      screen.getByRole('textbox', { name: `Department (required)` }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: `Role (required)` }),
    ).toBeVisible();
  });

  it.each`
    index | value
    ${0}  | ${'required'}
    ${1}  | ${'optional'}
    ${2}  | ${'optional'}
  `('the institution is $value for the %index position', ({ value, index }) => {
    renderUserPosition({
      position: {
        institution: 'FPF',
        department: '',
        role: '',
      },
      index,
    });

    expect(
      screen.getByRole('textbox', { name: `Institution (${value})` }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: `Department (required)` }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: `Role (required)` }),
    ).toBeVisible();
  });
});
