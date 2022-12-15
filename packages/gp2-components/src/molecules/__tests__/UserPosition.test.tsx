import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import UserPosition from '../UserPosition';

describe('UserPosition', () => {
  beforeEach(jest.resetAllMocks);
  type UserPositionProps = ComponentProps<typeof UserPosition>;
  const defaultProps: UserPositionProps = {
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
      screen.getByRole('textbox', { name: 'Primary Institution (required)' }),
    ).toHaveValue(position.institution);
    expect(
      screen.getByRole('textbox', { name: 'Primary Department (required)' }),
    ).toHaveValue(position.department);
    expect(
      screen.getByRole('textbox', { name: 'Primary Role (required)' }),
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
    userEvent.click(
      screen.getByRole('textbox', { name: /Secondary Institution/i }),
    );
    const institutionBox = await screen.findByText(institution);
    userEvent.click(institutionBox);

    expect(onChange).toHaveBeenCalledWith(
      {
        ...defaultProps.position,
        institution,
      },
      1,
    );
  });
  it('can save a position department', async () => {
    const onChange = jest.fn();
    const department = 'A';
    renderUserPosition({
      onChange,
      index: 1,
    });
    userEvent.type(
      screen.getByRole('textbox', { name: /Secondary Department/i }),
      department,
    );

    expect(onChange).toHaveBeenCalledWith(
      {
        ...defaultProps.position,
        department,
      },
      1,
    );
  });
  test('can save a position role', async () => {
    const onChange = jest.fn();
    const role = 'A';
    renderUserPosition({
      onChange,
      index: 1,
    });
    userEvent.type(
      screen.getByRole('textbox', { name: /Secondary Role/i }),
      role,
    );

    expect(onChange).toHaveBeenCalledWith(
      { ...defaultProps.position, role },
      1,
    );
  });
  test.each`
    index | prefix
    ${0}  | ${'Primary'}
    ${1}  | ${'Secondary'}
    ${2}  | ${'Other'}
  `('renders with the correct prefix for $index', ({ prefix, index }) => {
    renderUserPosition({
      index,
    });

    expect(
      screen.getByRole('textbox', { name: `${prefix} Institution (required)` }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: `${prefix} Department (required)` }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: `${prefix} Role (required)` }),
    ).toBeVisible();
  });
});
