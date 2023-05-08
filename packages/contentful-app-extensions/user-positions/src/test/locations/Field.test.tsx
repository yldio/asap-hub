import '@testing-library/jest-dom';
import React from 'react';
import Field from '../../locations/Field';
import { fireEvent, render, screen } from '@testing-library/react';
import { useSDK } from '@contentful/react-apps-toolkit';

const mockBaseSdk = {
  field: {
    getValue: jest.fn(() => []),
  },
  window: {
    startAutoResizer: jest.fn(),
  },
};

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
}));

describe('Field component', () => {
  it('renders initial positions if there is any', () => {
    (useSDK as jest.Mock).mockReturnValue({
      ...mockBaseSdk,
      field: {
        getValue: jest.fn(() => [
          {
            role: 'Some role',
            department: 'Some department',
            institution: 'Some institution',
          },
        ]),
      },
    });
    render(<Field />);

    expect(screen.getByText('Some role')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });

  it('renders only input fields and add button initially when there is not any previous positions', () => {
    (useSDK as jest.Mock).mockReturnValue({
      ...mockBaseSdk,
      field: {
        getValue: jest.fn(() => null),
      },
    });
    render(<Field />);

    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/institution/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /remove/i }),
    ).not.toBeInTheDocument();
  });

  it('updates positions field value', () => {
    const mockSdk = {
      ...mockBaseSdk,
      field: {
        getValue: jest.fn(() => []),
        setValue: jest.fn(),
      },
    };
    (useSDK as jest.Mock).mockReturnValue(mockSdk);
    render(<Field />);

    expect(
      screen.queryByRole('button', { name: /remove/i }),
    ).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();

    const roleInput = 'Some role';
    const departmentInput = 'Some department';
    const institutionInput = 'Some institution';
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: roleInput },
    });
    fireEvent.change(screen.getByLabelText(/department/i), {
      target: { value: departmentInput },
    });
    fireEvent.change(screen.getByLabelText(/institution/i), {
      target: { value: institutionInput },
    });

    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByText(`${roleInput}`)).toBeInTheDocument();
    expect(screen.getByText(`${departmentInput}`)).toBeInTheDocument();
    expect(screen.getByText(`${institutionInput}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();

    expect(mockSdk.field.setValue).toHaveBeenCalledWith([
      {
        role: 'Some role',
        department: 'Some department',
        institution: 'Some institution',
      },
    ]);
  });

  it('remove button works', () => {
    const mockSdk = {
      ...mockBaseSdk,
      field: {
        getValue: jest.fn(() => [
          {
            role: 'Some role',
            department: 'Some department',
            institution: 'Some institution',
          },
        ]),
        setValue: jest.fn(),
      },
    };
    (useSDK as jest.Mock).mockReturnValue(mockSdk);
    render(<Field />);

    expect(screen.getByText('Some role')).toBeInTheDocument();
    expect(screen.getByText('Some department')).toBeInTheDocument();
    expect(screen.getByText('Some institution')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /remove/i }));

    expect(mockSdk.field.setValue).toBeCalledWith(undefined);

    expect(screen.queryByRole('Some role')).not.toBeInTheDocument();
    expect(screen.queryByRole('Some department')).not.toBeInTheDocument();
    expect(screen.queryByRole('Some institution')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /remove/i }),
    ).not.toBeInTheDocument();
  });

  it("shows an error message when user tries to add a new position but doesn't fill all the inputs", () => {
    const mockSdk = {
      ...mockBaseSdk,
      field: {
        getValue: jest.fn(() => null),
        setValue: jest.fn(),
      },
      notifier: {
        error: jest.fn(),
      },
    };
    (useSDK as jest.Mock).mockReturnValue(mockSdk);
    render(<Field />);

    expect(
      screen.queryByRole('button', { name: /remove/i }),
    ).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();

    const roleInput = 'Some role';
    const departmentInput = 'Some department';
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: roleInput },
    });
    fireEvent.change(screen.getByLabelText(/department/i), {
      target: { value: departmentInput },
    });

    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(mockSdk.notifier.error).toHaveBeenCalledWith(
      'All fields are required.',
    );
  });

  it('shows an error message when user tries to add a duplicated position', () => {
    const mockSdk = {
      ...mockBaseSdk,
      field: {
        getValue: jest.fn(() => [
          {
            role: 'Some role',
            department: 'Some department',
            institution: 'Some institution',
          },
        ]),
        setValue: jest.fn(),
      },
      notifier: {
        error: jest.fn(),
      },
    };
    (useSDK as jest.Mock).mockReturnValue(mockSdk);
    render(<Field />);

    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();

    const roleInput = 'Some role';
    const departmentInput = 'Some department';
    const institutionInput = 'Some institution';
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: roleInput },
    });
    fireEvent.change(screen.getByLabelText(/department/i), {
      target: { value: departmentInput },
    });
    fireEvent.change(screen.getByLabelText(/institution/i), {
      target: { value: institutionInput },
    });

    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(mockSdk.notifier.error).toHaveBeenCalledWith(
      'Duplicated entry. Please add different values.',
    );
  });
});
