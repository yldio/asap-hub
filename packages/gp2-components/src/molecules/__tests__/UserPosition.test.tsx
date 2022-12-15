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
    });
    userEvent.type(
      screen.getByRole('textbox', { name: /Department/i }),
      department,
    );

    expect(onChange).toHaveBeenCalledWith({
      ...defaultProps.position,
      department,
    });
  });
  test('can save a position role', async () => {
    const onChange = jest.fn();
    const role = 'A';
    renderUserPosition({
      onChange,
      index: 1,
    });
    userEvent.type(screen.getByRole('textbox', { name: /Role/i }), role);

    expect(onChange).toHaveBeenCalledWith({ ...defaultProps.position, role });
  });
  test.each`
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
    expect(
      screen.getByRole('textbox', { name: `Institution (required)` }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: `Department (required)` }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: `Role (required)` }),
    ).toBeVisible();
  });
  test('can delete a position', () => {
    const onRemove = jest.fn();
    renderUserPosition({ onRemove });
    const removeButton = screen.getByRole('button');
    userEvent.click(removeButton);
    expect(onRemove).toBeCalled();
  });
});
