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
  it('renders initial additional materials if there is any', () => {
    (useSDK as jest.Mock).mockReturnValue({
      ...mockBaseSdk,
      field: {
        getValue: jest.fn(() => [
          {
            title: 'Youtube Channel',
            url: 'https://www.youtube.com/id',
          },
        ]),
      },
    });
    render(<Field />);

    expect(
      screen.getByText('Youtube Channel - https://www.youtube.com/id'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });

  it('renders only input fields and add button initially when there is not any previous additional material', () => {
    (useSDK as jest.Mock).mockReturnValue({
      ...mockBaseSdk,
      field: {
        getValue: jest.fn(() => []),
      },
    });
    render(<Field />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /remove/i }),
    ).not.toBeInTheDocument();
  });

  it('updates additional materials field value', () => {
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

    const titleInput = 'Presentation';
    const urlInput = 'http://www.google-drive.com/presentation-id';
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: titleInput },
    });
    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: urlInput },
    });

    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByText(`${titleInput} - ${urlInput}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();

    expect(mockSdk.field.setValue).toHaveBeenCalledWith([
      {
        title: 'Presentation',
        url: 'http://www.google-drive.com/presentation-id',
      },
    ]);
  });

  it('remove button works', () => {
    const mockSdk = {
      ...mockBaseSdk,
      field: {
        getValue: jest.fn(() => [
          {
            title: 'Youtube Channel',
            url: 'https://www.youtube.com/id',
          },
        ]),
        setValue: jest.fn(),
      },
    };
    (useSDK as jest.Mock).mockReturnValue(mockSdk);
    render(<Field />);

    expect(
      screen.getByText('Youtube Channel - https://www.youtube.com/id'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /remove/i }));

    expect(mockSdk.field.setValue).toBeCalledWith([]);

    expect(
      screen.queryByRole('Youtube Channel - https://www.youtube.com/id'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /remove/i }),
    ).not.toBeInTheDocument();
  });

  it('shows an error message when url inputted is invalid', () => {
    const mockSdk = {
      ...mockBaseSdk,
      field: {
        getValue: jest.fn(() => []),
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

    const titleInput = 'Presentation';
    const urlInput = 'invalid-url';
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: titleInput },
    });
    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: urlInput },
    });

    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(mockSdk.notifier.error).toHaveBeenCalledWith(
      'Invalid URL in Additional Materials',
    );
  });

  it('shows an error message when url is invalid but no title is given', () => {
    const mockSdk = {
      ...mockBaseSdk,
      field: {
        getValue: jest.fn(() => []),
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

    const urlInput = 'http://www.google-drive.com/presentation-id';
    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: urlInput },
    });

    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(mockSdk.notifier.error).toHaveBeenCalledWith(
      'A not empty title is required in Additional Materials',
    );
  });
});
