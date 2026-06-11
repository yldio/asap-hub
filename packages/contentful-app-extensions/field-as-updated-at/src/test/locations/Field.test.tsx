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
      parameters: {
        instance: {
          observedField: 'video',
        },
      },
      contentType: {
        fields: [{ id: 'video', type: 'RichText' }],
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

  it('updates the field value when observed RichText field changes', () => {
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
      contentType: {
        fields: [{ id: 'video', type: 'RichText' }],
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

  it('updates the field value when observed Date field changes', () => {
    const getMockContent = () => ({
      id: '456',
      publishedCounter: 2,
      space: { sys: { id: '123' } },
      publishedAt: '2026-06-11T18:00:00.000Z',
    });

    const mockTestSdk = {
      field: {
        getValue: jest.fn(() => undefined),
        setValue: jest.fn(),
      },
      parameters: {
        instance: {
          observedField: 'alumniSinceDate',
        },
      },
      contentType: {
        fields: [{ id: 'alumniSinceDate', type: 'Date' }],
      },
      entry: {
        publish: jest.fn(),
        getSys: jest.fn(() => ({ publishedCounter: 1 })),
        onSysChanged: jest.fn((cb) => {
          cb(getMockContent());
          return jest.fn();
        }),
        fields: {
          alumniSinceDate: {
            getValue: jest
              .fn()
              .mockReturnValueOnce(undefined)
              .mockReturnValueOnce('2026-06-10T00:00:00.000Z'),
          },
        },
      },
    };
    (useSDK as jest.Mock).mockReturnValue(mockTestSdk);

    render(<Field />);

    expect(screen.getByText('2026-06-11T18:00:00.000Z')).toBeInTheDocument();
    expect(mockTestSdk.field.setValue).toHaveBeenCalledWith(
      '2026-06-11T18:00:00.000Z',
    );
    waitFor(() => {
      expect(mockTestSdk.entry.publish).toHaveBeenCalled();
    });
  });

  it('updates the field value when observed Symbol field changes', () => {
    const getMockContent = () => ({
      id: '456',
      publishedCounter: 2,
      space: { sys: { id: '123' } },
      publishedAt: '2026-06-11T18:00:00.000Z',
    });

    const mockTestSdk = {
      field: {
        getValue: jest.fn(() => undefined),
        setValue: jest.fn(),
      },
      parameters: {
        instance: {
          observedField: 'orcid',
        },
      },
      contentType: {
        fields: [{ id: 'orcid', type: 'Symbol' }],
      },
      entry: {
        publish: jest.fn(),
        getSys: jest.fn(() => ({ publishedCounter: 1 })),
        onSysChanged: jest.fn((cb) => {
          cb(getMockContent());
          return jest.fn();
        }),
        fields: {
          orcid: {
            getValue: jest
              .fn()
              .mockReturnValueOnce('0000-0000-0000-0001')
              .mockReturnValueOnce('0000-0000-0000-0002'),
          },
        },
      },
    };
    (useSDK as jest.Mock).mockReturnValue(mockTestSdk);

    render(<Field />);

    expect(screen.getByText('2026-06-11T18:00:00.000Z')).toBeInTheDocument();
    expect(mockTestSdk.field.setValue).toHaveBeenCalledWith(
      '2026-06-11T18:00:00.000Z',
    );
  });

  it('does not stamp when publishedCounter has not increased', () => {
    const mockTestSdk = {
      field: {
        getValue: jest.fn(() => undefined),
        setValue: jest.fn(),
      },
      parameters: {
        instance: {
          observedField: 'alumniSinceDate',
        },
      },
      contentType: {
        fields: [{ id: 'alumniSinceDate', type: 'Date' }],
      },
      entry: {
        publish: jest.fn(),
        getSys: jest.fn(() => ({ publishedCounter: 2 })),
        onSysChanged: jest.fn((cb) => {
          cb({
            id: '456',
            publishedCounter: 2,
            space: { sys: { id: '123' } },
            publishedAt: '2026-06-11T18:00:00.000Z',
          });
          return jest.fn();
        }),
        fields: {
          alumniSinceDate: {
            getValue: jest
              .fn()
              .mockReturnValueOnce('2026-06-10T00:00:00.000Z')
              .mockReturnValueOnce('2026-06-11T00:00:00.000Z'),
          },
        },
      },
    };
    (useSDK as jest.Mock).mockReturnValue(mockTestSdk);

    render(<Field />);

    expect(mockTestSdk.field.setValue).not.toHaveBeenCalled();
    expect(mockTestSdk.entry.publish).not.toHaveBeenCalled();
  });

  it('clears the displayed field when observed value is cleared on publish', () => {
    const getMockContent = () => ({
      id: '456',
      publishedCounter: 2,
      space: { sys: { id: '123' } },
      publishedAt: '2026-06-11T18:00:00.000Z',
    });

    const mockTestSdk = {
      field: {
        getValue: jest.fn(() => '2026-06-10T18:00:00.000Z'),
        setValue: jest.fn(),
      },
      parameters: {
        instance: {
          observedField: 'alumniSinceDate',
        },
      },
      contentType: {
        fields: [{ id: 'alumniSinceDate', type: 'Date' }],
      },
      entry: {
        publish: jest.fn(),
        getSys: jest.fn(() => ({ publishedCounter: 1 })),
        onSysChanged: jest.fn((cb) => {
          cb(getMockContent());
          return jest.fn();
        }),
        fields: {
          alumniSinceDate: {
            getValue: jest
              .fn()
              .mockReturnValueOnce('2026-06-10T00:00:00.000Z')
              .mockReturnValueOnce(undefined),
          },
        },
      },
    };
    (useSDK as jest.Mock).mockReturnValue(mockTestSdk);

    render(<Field />);

    expect(mockTestSdk.field.setValue).toHaveBeenCalledWith(
      '2026-06-11T18:00:00.000Z',
    );
  });
});
