import '@testing-library/jest-dom';
import React from 'react';
import Field from '../../locations/Field';
import { render, screen, waitFor } from '@testing-library/react';

import { useSDK } from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
}));

describe('Field component', () => {
  it('renders the field initial value', () => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      field: {
        getValue: jest.fn(() => '2023-04-12T16:05:00.000Z'),
      },
      entry: {
        onSysChanged: jest.fn(() => ({
          id: '123',
          space: {
            sys: {
              id: '456',
            },
          },
          firstPublishedAt: '2390-08-23T15:27:27.861Z',
        })),
      },
    }));
    render(<Field />);

    expect(screen.getByText('2023-04-12T16:05:00.000Z')).toBeInTheDocument();
  });

  it('updates the field value when field is not populated yet, entry has firstPublishedAt and there is a change in the sys value', () => {
    const getMockContent = () => ({
      id: '456',
      space: {
        sys: {
          id: '123',
        },
      },
      firstPublishedAt: '2023-04-14T18:00:00.000Z',
    });

    const mockTestSdk = {
      field: {
        getValue: jest.fn(),
        setValue: jest.fn(),
      },
      entry: {
        onSysChanged: jest.fn((cb) => {
          cb(getMockContent());
          return jest.fn();
        }),
        publish: jest.fn(),
      },
    };
    (useSDK as jest.Mock).mockReturnValue(mockTestSdk);

    render(<Field />);

    expect(mockTestSdk.entry.onSysChanged).toHaveBeenCalled();
    expect(screen.getByText('2023-04-14T18:00:00.000Z')).toBeInTheDocument();
    expect(mockTestSdk.field.setValue).toHaveBeenCalledWith(
      '2023-04-14T18:00:00.000Z',
    );
    waitFor(() => {
      expect(mockTestSdk.entry.publish).toHaveBeenCalled();
    });
  });

  it('does not updates the field value if field is already populated and there is a change in the sys value', () => {
    const getMockContent = () => ({
      id: '456',
      space: {
        sys: {
          id: '123',
        },
      },
      firstPublishedAt: '2023-04-14T18:00:00.000Z',
    });

    const mockTestSdk = {
      field: {
        getValue: jest.fn(() => '2023-04-13T16:05:00.000Z'),
      },
      entry: {
        onSysChanged: jest.fn((cb) => {
          cb(getMockContent());
          return jest.fn();
        }),
      },
    };
    (useSDK as jest.Mock).mockReturnValue(mockTestSdk);

    render(<Field />);

    expect(mockTestSdk.entry.onSysChanged).toHaveBeenCalled();
    expect(screen.getByText('2023-04-13T16:05:00.000Z')).toBeInTheDocument();
  });
});
