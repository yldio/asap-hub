import '@testing-library/jest-dom';
import React from 'react';
import Field from '../../locations/Field';
import { render, screen, waitFor } from '@testing-library/react';

import { useSDK } from '@contentful/react-apps-toolkit';
import { EntrySys } from '@contentful/app-sdk';

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
        onSysChanged: jest.fn(() => jest.fn()),
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

  describe('multi-field observedField', () => {
    const buildSdk = (
      observedField: string,
      fields: Record<string, { type: string; values: [unknown, unknown] }>,
    ) => ({
      field: {
        getValue: jest.fn(() => undefined),
        setValue: jest.fn(),
        removeValue: jest.fn(),
      },
      parameters: {
        instance: { observedField },
      },
      contentType: {
        fields: Object.entries(fields).map(([id, { type }]) => ({ id, type })),
      },
      entry: {
        publish: jest.fn(),
        getSys: jest.fn(() => ({ publishedCounter: 1 })),
        onSysChanged: jest.fn((cb) => {
          cb({
            id: 'sys-id',
            publishedCounter: 2,
            space: { sys: { id: 'space-id' } },
            publishedAt: '2026-06-11T18:00:00.000Z',
          });
          return jest.fn();
        }),
        fields: Object.fromEntries(
          Object.entries(fields).map(([id, { values }]) => [
            id,
            {
              getValue: jest
                .fn()
                .mockReturnValueOnce(values[0])
                .mockReturnValueOnce(values[1]),
            },
          ]),
        ),
      },
    });

    it('stamps when the first of the two observed fields changes', () => {
      const sdk = buildSdk('alumniSinceDate, alumniLocation', {
        alumniSinceDate: {
          type: 'Date',
          values: [undefined, '2026-06-10T00:00:00.000Z'],
        },
        alumniLocation: {
          type: 'Symbol',
          values: ['Lisbon', 'Lisbon'],
        },
      });
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);

      expect(sdk.field.setValue).toHaveBeenCalledWith(
        '2026-06-11T18:00:00.000Z',
      );
    });

    it('stamps when only the second observed field changes', () => {
      const sdk = buildSdk('alumniSinceDate,alumniLocation', {
        alumniSinceDate: {
          type: 'Date',
          values: ['2026-06-10T00:00:00.000Z', '2026-06-10T00:00:00.000Z'],
        },
        alumniLocation: {
          type: 'Symbol',
          values: ['Lisbon', 'Berlin'],
        },
      });
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);

      expect(sdk.field.setValue).toHaveBeenCalledWith(
        '2026-06-11T18:00:00.000Z',
      );
    });

    it('stamps once when both observed fields change in the same publish', () => {
      const sdk = buildSdk('alumniSinceDate,alumniLocation', {
        alumniSinceDate: {
          type: 'Date',
          values: ['2026-06-10T00:00:00.000Z', '2026-06-11T00:00:00.000Z'],
        },
        alumniLocation: {
          type: 'Symbol',
          values: ['Lisbon', 'Berlin'],
        },
      });
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(sdk.field.setValue).toHaveBeenCalledWith(
        '2026-06-11T18:00:00.000Z',
      );
    });

    it('does not stamp when none of the observed fields change', () => {
      const sdk = buildSdk('alumniSinceDate,alumniLocation', {
        alumniSinceDate: {
          type: 'Date',
          values: ['2026-06-10T00:00:00.000Z', '2026-06-10T00:00:00.000Z'],
        },
        alumniLocation: {
          type: 'Symbol',
          values: ['Lisbon', 'Lisbon'],
        },
      });
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);

      expect(sdk.field.setValue).not.toHaveBeenCalled();
      expect(sdk.entry.publish).not.toHaveBeenCalled();
    });

    it('clears the timestamp when all observed values are emptied', () => {
      const sdk = buildSdk('alumniSinceDate,alumniLocation', {
        alumniSinceDate: {
          type: 'Date',
          values: ['2026-06-10T00:00:00.000Z', undefined],
        },
        alumniLocation: {
          type: 'Symbol',
          values: ['Lisbon', undefined],
        },
      });
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);

      expect(sdk.field.removeValue).toHaveBeenCalled();
      expect(sdk.field.setValue).not.toHaveBeenCalled();
    });

    it('bails out of in-flight callbacks after unmount', async () => {
      let storedCallback: ((sys: EntrySys) => Promise<void>) | null = null;

      const sdk = {
        field: {
          getValue: jest.fn(() => undefined),
          setValue: jest.fn(),
          removeValue: jest.fn(),
        },
        parameters: { instance: { observedField: 'alumniSinceDate' } },
        contentType: { fields: [{ id: 'alumniSinceDate', type: 'Date' }] },
        entry: {
          publish: jest.fn(),
          getSys: jest.fn(() => ({ publishedCounter: 1 })),
          onSysChanged: jest.fn((cb) => {
            storedCallback = cb;
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
      (useSDK as jest.Mock).mockReturnValue(sdk);

      const { unmount } = render(<Field />);
      unmount();

      await storedCallback!({
        publishedCounter: 2,
        publishedAt: '2026-06-11T18:00:00.000Z',
      } as EntrySys);

      expect(sdk.field.setValue).not.toHaveBeenCalled();
      expect(sdk.field.removeValue).not.toHaveBeenCalled();
      expect(sdk.entry.publish).not.toHaveBeenCalled();
    });

    it('keeps listening after the first stamp so a subsequent clear publish clears the timestamp', async () => {
      let storedCallback: ((sys: EntrySys) => Promise<void>) | null = null;
      let publishedCounter = 1;

      const observedValue = jest
        .fn()
        .mockReturnValueOnce('2026-06-10T00:00:00.000Z')
        .mockReturnValueOnce('2026-06-11T00:00:00.000Z')
        .mockReturnValueOnce(undefined);

      const sdk = {
        field: {
          getValue: jest.fn(() => undefined),
          setValue: jest.fn(),
          removeValue: jest.fn(),
        },
        parameters: { instance: { observedField: 'alumniSinceDate' } },
        contentType: { fields: [{ id: 'alumniSinceDate', type: 'Date' }] },
        entry: {
          publish: jest.fn(() => {
            publishedCounter += 1;
            return Promise.resolve();
          }),
          getSys: jest.fn(() => ({ publishedCounter })),
          onSysChanged: jest.fn((cb) => {
            storedCallback = cb;
            return jest.fn();
          }),
          fields: { alumniSinceDate: { getValue: observedValue } },
        },
      };
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);

      // First publish: alumniSinceDate moves from 2026-06-10 to 2026-06-11
      publishedCounter = 2;
      await storedCallback!({
        publishedCounter: 2,
        publishedAt: '2026-06-11T18:00:00.000Z',
      } as EntrySys);

      expect(sdk.field.setValue).toHaveBeenCalledWith(
        '2026-06-11T18:00:00.000Z',
      );

      // Second publish: user clears alumniSinceDate
      publishedCounter = 4;
      await storedCallback!({
        publishedCounter: 4,
        publishedAt: '2026-06-12T18:00:00.000Z',
      } as EntrySys);

      expect(sdk.field.removeValue).toHaveBeenCalled();
    });
  });
});
