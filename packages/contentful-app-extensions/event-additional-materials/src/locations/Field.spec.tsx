import React from 'react';
import Field from './Field';
import { fireEvent, getByRole, render } from '@testing-library/react';
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
    const { getByText, container } = render(<Field />);

    expect(
      getByText('Youtube Channel - https://www.youtube.com/id'),
    ).toBeInTheDocument();
    expect(
      getByRole(container, 'button', { name: /remove/i }),
    ).toBeInTheDocument();
  });

  it('renders only input fields and add button initially when there is not any previous additional material', () => {
    (useSDK as jest.Mock).mockReturnValue({
      ...mockBaseSdk,
      field: {
        getValue: jest.fn(() => []),
      },
    });
    const { queryByRole, getByLabelText, container } = render(<Field />);

    expect(getByLabelText(/title/i)).toBeInTheDocument();
    expect(getByLabelText(/url/i)).toBeInTheDocument();
    expect(
      getByRole(container, 'button', { name: /add/i }),
    ).toBeInTheDocument();
    expect(queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
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
    const { getByText, queryByRole, getByLabelText, container } = render(
      <Field />,
    );

    expect(queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();

    expect(
      getByRole(container, 'button', { name: /add/i }),
    ).toBeInTheDocument();

    const titleInput = 'Presentation';
    const urlInput = 'http://www.google-drive.com/presentation-id';
    fireEvent.change(getByLabelText(/title/i), {
      target: { value: titleInput },
    });
    fireEvent.change(getByLabelText(/url/i), { target: { value: urlInput } });

    fireEvent.click(getByRole(container, 'button', { name: /add/i }));

    expect(getByText(`${titleInput} - ${urlInput}`)).toBeInTheDocument();
    expect(
      getByRole(container, 'button', { name: /remove/i }),
    ).toBeInTheDocument();

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
    const { queryByRole, getByText, container } = render(<Field />);

    expect(
      getByText('Youtube Channel - https://www.youtube.com/id'),
    ).toBeInTheDocument();
    expect(
      getByRole(container, 'button', { name: /remove/i }),
    ).toBeInTheDocument();

    fireEvent.click(getByRole(container, 'button', { name: /remove/i }));

    expect(mockSdk.field.setValue).toBeCalledWith([]);

    expect(
      queryByRole('Youtube Channel - https://www.youtube.com/id'),
    ).not.toBeInTheDocument();
    expect(queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
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
    const { queryByRole, getByLabelText, container } = render(<Field />);

    expect(queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();

    expect(
      getByRole(container, 'button', { name: /add/i }),
    ).toBeInTheDocument();

    const titleInput = 'Presentation';
    const urlInput = 'invalid-url';
    fireEvent.change(getByLabelText(/title/i), {
      target: { value: titleInput },
    });
    fireEvent.change(getByLabelText(/url/i), { target: { value: urlInput } });

    fireEvent.click(getByRole(container, 'button', { name: /add/i }));

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
    const { queryByRole, getByLabelText, container } = render(<Field />);

    expect(queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();

    expect(
      getByRole(container, 'button', { name: /add/i }),
    ).toBeInTheDocument();

    const urlInput = 'http://www.google-drive.com/presentation-id';
    fireEvent.change(getByLabelText(/url/i), { target: { value: urlInput } });

    fireEvent.click(getByRole(container, 'button', { name: /add/i }));

    expect(mockSdk.notifier.error).toHaveBeenCalledWith(
      'A not empty title is required in Additional Materials',
    );
  });
});
