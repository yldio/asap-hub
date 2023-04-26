import React from 'react';
import Field from '../../locations/Field';
import { render, screen } from '@testing-library/react';

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
  });
});
