import '@testing-library/jest-dom';
import React from 'react';
import Field from '../../locations/Field';
import { render, screen, waitFor } from '@testing-library/react';

import { useSDK } from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
}));

describe('Field component', () => {
  it('renders the field value', () => {
    const getMockContent = () => ({
      id: '12',
      publishedCounter: 2,
    });

    const mockTestSdk = {
      field: {
        getValue: jest.fn(() => '2023-04-12T16:05:00.000Z'),
        onSchemaErrorsChanged: jest.fn(),
        onIsDisabledChanged: jest.fn(),
        onValueChanged: jest.fn(),
      },
      entry: {
        getSys: jest.fn(() => ({
          publishedCounter: 1,
        })),
        onSysChanged: jest.fn((cb) => {
          cb(getMockContent());
          return jest.fn();
        }),
      },
      window: {
        startAutoResizer: jest.fn(),
      },
    };

    (useSDK as jest.Mock).mockReturnValue(mockTestSdk);
    render(<Field />);

    expect(screen.getByDisplayValue('12 Apr 2023')).toBeInTheDocument();
  });

  it('updates the field value to publishedAt date when field is not populated and entry has just been published', () => {
    const getMockContent = () => ({
      id: '12',
      publishedCounter: 2,
      publishedAt: '2023-04-14T18:00:00.000Z',
    });

    const mockTestSdk = {
      field: {
        getValue: jest.fn(),
        setValue: jest.fn(),
        onSchemaErrorsChanged: jest.fn(),
        onIsDisabledChanged: jest.fn(),
        onValueChanged: jest.fn(),
      },
      entry: {
        getSys: jest.fn(() => ({
          publishedCounter: 1,
        })),
        onSysChanged: jest.fn((cb) => {
          cb(getMockContent());
          return jest.fn();
        }),
        publish: jest.fn(),
      },
      window: {
        startAutoResizer: jest.fn(),
      },
    };

    (useSDK as jest.Mock).mockReturnValue(mockTestSdk);

    render(<Field />);

    expect(mockTestSdk.entry.onSysChanged).toHaveBeenCalled();

    expect(mockTestSdk.field.setValue).toHaveBeenCalledWith(
      '2023-04-14T18:00:00.000Z',
    );
    waitFor(() => {
      expect(mockTestSdk.entry.publish).toHaveBeenCalled();
    });
  });

  it('does not update the field value if field is already populated and there is a change in the sys value', () => {
    const getMockContent = () => ({
      id: '12',
      publishedCounter: 2,
      publishedAt: '2023-04-14T18:00:00.000Z',
    });

    const mockTestSdk = {
      field: {
        getValue: jest.fn(() => '2023-05-14T18:00:00.000Z'),
        setValue: jest.fn(),
        onSchemaErrorsChanged: jest.fn(),
        onIsDisabledChanged: jest.fn(),
        onValueChanged: jest.fn(),
      },
      entry: {
        getSys: jest.fn(() => ({
          publishedCounter: 1,
        })),
        onSysChanged: jest.fn((cb) => {
          cb(getMockContent());
          return jest.fn();
        }),
        publish: jest.fn(),
      },
      window: {
        startAutoResizer: jest.fn(),
      },
    };

    (useSDK as jest.Mock).mockReturnValue(mockTestSdk);

    render(<Field />);

    expect(mockTestSdk.entry.onSysChanged).toHaveBeenCalled();
    expect(mockTestSdk.field.setValue).not.toHaveBeenCalled();
    expect(mockTestSdk.entry.publish).not.toHaveBeenCalled();
  });
});
