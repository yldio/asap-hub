import '@testing-library/jest-dom';
import React from 'react';
import Field from '../../locations/Field';
import { render, screen, waitFor } from '@testing-library/react';

import { useSDK } from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
}));

const makeSdk = (
  observedField: string,
  fields: Record<string, { getValue: jest.Mock }>,
) => ({
  field: {
    getValue: jest.fn(() => '2023-04-13T16:05:00.000Z'),
    setValue: jest.fn(),
  },
  parameters: { instance: { observedField } },
  entry: {
    publish: jest.fn(),
    getSys: jest.fn(() => ({ publishedCounter: 1 })),
    onSysChanged: jest.fn((cb) => {
      cb({ publishedCounter: 2, publishedAt: '2026-06-03T10:00:00.000Z' });
      return jest.fn();
    }),
    fields,
  },
});

describe('Field component', () => {
  it('renders the field initial value', () => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      field: {
        getValue: jest.fn(() => '2023-04-12T16:05:00.000Z'),
      },
      parameters: {
        instance: {
          observedField: 'video',
        },
      },
      entry: {
        getSys: jest.fn(() => ({
          publishedCounter: 1,
        })),
        onSysChanged: jest.fn(() => ({
          id: '123',
          space: {
            sys: {
              id: '456',
            },
          },
          publishedCounter: 2,
          updatedAt: '2390-08-23T15:27:27.861Z',
        })),
        fields: {
          video: {
            getValue: jest.fn(),
          },
        },
      },
    }));
    render(<Field />);

    expect(screen.getByText('2023-04-12T16:05:00.000Z')).toBeInTheDocument();
  });

  it('updates the field value when observed field changes', () => {
    const textDocument = {
      content: [
        {
          content: [
            {
              data: {},
              marks: [],
              value: 'Hello world',
              nodeType: 'text',
            },
          ],
          data: {},
          nodeType: 'paragraph',
        },
      ],
      data: {},
      nodeType: 'document',
    };

    const updatedTextDocument = {
      content: [
        {
          content: [
            {
              data: {},
              marks: [],
              value: 'Hello world!',
              nodeType: 'text',
            },
          ],
          data: {},
          nodeType: 'paragraph',
        },
      ],
      data: {},
      nodeType: 'document',
    };

    const getMockContent = () => ({
      id: '456',
      publishedCounter: 2,
      space: {
        sys: {
          id: '123',
        },
      },
      publishedAt: '2023-04-14T18:00:00.000Z',
    });

    const mockTestSdk = {
      field: {
        getValue: jest.fn(() => '2023-04-13T16:05:00.000Z'),
        setValue: jest.fn(),
      },
      parameters: {
        instance: {
          observedField: 'video',
        },
      },
      entry: {
        publish: jest.fn(),
        getSys: jest.fn(() => ({
          publishedCounter: 1,
        })),
        onSysChanged: jest.fn((cb) => {
          cb(getMockContent());
          return jest.fn();
        }),
        fields: {
          video: {
            getValue: jest
              .fn()
              .mockReturnValueOnce(textDocument)
              .mockReturnValueOnce(updatedTextDocument),
          },
        },
      },
    };
    (useSDK as jest.Mock).mockReturnValue(mockTestSdk);

    render(<Field />);

    expect(mockTestSdk.entry.getSys).toHaveBeenCalled();
    expect(mockTestSdk.entry.onSysChanged).toHaveBeenCalled();
    expect(screen.getByText('2023-04-14T18:00:00.000Z')).toBeInTheDocument();

    expect(mockTestSdk.field.setValue).toHaveBeenCalledWith(
      '2023-04-14T18:00:00.000Z',
    );
    waitFor(() => {
      expect(mockTestSdk.entry.publish).toHaveBeenCalled();
    });
  });

  const makeDoc = (value: string) => ({
    content: [
      {
        content: [{ data: {}, marks: [], value, nodeType: 'text' }],
        data: {},
        nodeType: 'paragraph',
      },
    ],
    data: {},
    nodeType: 'document',
  });

  it('updates when any of the comma-separated observed fields change', () => {
    const sdk = makeSdk('alumniSinceDate, alumniLocation', {
      alumniSinceDate: {
        getValue: jest
          .fn()
          .mockReturnValueOnce(makeDoc('2024-01-01'))
          .mockReturnValueOnce(makeDoc('2024-01-01')),
      },
      alumniLocation: {
        getValue: jest
          .fn()
          .mockReturnValueOnce(makeDoc('Old City'))
          .mockReturnValueOnce(makeDoc('New City')),
      },
    });
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Field />);

    expect(sdk.field.setValue).toHaveBeenCalledWith('2026-06-03T10:00:00.000Z');
  });

  it('clears the timestamp when the observed field is emptied', () => {
    const sdk = makeSdk('alumniLocation', {
      alumniLocation: {
        getValue: jest
          .fn()
          .mockReturnValueOnce(makeDoc('something'))
          .mockReturnValueOnce(undefined),
      },
    });
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Field />);

    expect(sdk.field.setValue).toHaveBeenCalledWith(undefined);
    expect(
      screen.queryByText('2026-06-03T10:00:00.000Z'),
    ).not.toBeInTheDocument();
  });

  it('does not update when none of the observed fields change', () => {
    const sameDoc = makeDoc('unchanged');
    const sdk = makeSdk('alumniSinceDate,alumniLocation', {
      alumniSinceDate: { getValue: jest.fn(() => sameDoc) },
      alumniLocation: { getValue: jest.fn(() => sameDoc) },
    });
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Field />);

    expect(sdk.field.setValue).not.toHaveBeenCalled();
    expect(sdk.entry.publish).not.toHaveBeenCalled();
  });
});
