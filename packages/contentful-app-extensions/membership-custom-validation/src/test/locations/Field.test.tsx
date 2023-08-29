import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import Field, {
  VALID_ENTRY_MESSAGE,
  DUPLICATE_MEMBERS_MESSAGE,
} from '../../locations/Field';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
  useAutoResizer: jest.fn(),
}));

const memberFields = {
  role: {
    'en-US': 'Project Manager',
  },
  user: {
    'en-US': {
      sys: {
        id: 'user-1',
      },
    },
  },
};

const unsubscribeFn = () => {};
const mockBaseSdk = () => ({
  field: {
    setValue: jest.fn(),
  },
  entry: {
    getSys: jest.fn(),
    getMetadata: jest.fn(),
    fields: {
      members: {
        id: 'members',
        onValueChanged: jest.fn(() => unsubscribeFn),
        getValue: jest.fn(() => [
          {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: 'member-link-1',
            },
          },
        ]),
      },
    },
    onMetadataChanged: jest.fn(() => unsubscribeFn),
    onSysChanged: jest.fn((cb) => {
      cb(() => ({
        id: '456',
        space: {
          sys: {
            id: '123',
          },
        },
        firstPublishedAt: '2023-04-14T18:00:00.000Z',
      }));
      return jest.fn(() => unsubscribeFn);
    }),
  },
  cma: {
    entry: {
      getMany: jest.fn(() =>
        Promise.resolve({
          items: [
            {
              fields: memberFields,
            },
          ],
        }),
      ),
      get: jest.fn(() =>
        Promise.resolve({
          sys: {
            contentType: {
              sys: {
                id: 'users',
              },
            },
          },
        }),
      ),
    },
  },
});

describe('Field component', () => {
  let sdk: jest.Mocked<FieldExtensionSDK>;

  beforeEach(() => {
    jest.clearAllMocks();

    sdk = mockBaseSdk() as unknown as jest.Mocked<FieldExtensionSDK>;
    (useSDK as jest.Mock).mockReturnValue(sdk);
  });

  it('enables automatic resizing', async () => {
    render(<Field />);
    await waitFor(() => {
      expect(useAutoResizer).toHaveBeenCalled();
    });
  });

  it('displays warning message when a user is added multiple times', async () => {
    const baseSdk = mockBaseSdk();
    const testSdk = {
      ...baseSdk,
      cma: {
        entry: {
          getMany: jest.fn((param) =>
            Promise.resolve({
              items: [
                {
                  fields: memberFields,
                },
                {
                  fields: memberFields,
                },
              ],
            }),
          ),
          get: jest.fn((param) => {
            return Promise.resolve({
              sys: {
                contentType: {
                  sys: {
                    id: 'users',
                  },
                },
              },
              fields: {
                firstName: {
                  'en-US': 'John',
                },
                lastName: {
                  'en-US': 'Doe',
                },
              },
            });
          }),
        },
      },
    } as unknown as jest.Mocked<FieldExtensionSDK>;
    (useSDK as jest.Mock).mockReturnValue(testSdk);

    render(<Field />);
    await waitFor(() => {
      expect(testSdk.field.setValue).toHaveBeenCalledWith('false');
    });
    expect(
      await screen.findByText(
        'User John Doe has been added in multiple roles [Project Manager, Project Manager].',
      ),
    ).toBeInTheDocument();
  });

  it('displays warning message when the same membership is added multiple times', async () => {
    const baseSdk = mockBaseSdk();
    const testSdk = {
      ...baseSdk,
      entry: {
        ...baseSdk.entry,
        fields: {
          members: {
            id: 'members',
            onValueChanged: jest.fn(() => unsubscribeFn),
            getValue: jest.fn(() => [
              {
                sys: {
                  type: 'Link',
                  linkType: 'Entry',
                  id: 'member-link-1',
                },
              },
              {
                sys: {
                  type: 'Link',
                  linkType: 'Entry',
                  id: 'member-link-1',
                },
              },
            ]),
          },
        },        
      },
      cma: {
        entry: {
          getMany: jest.fn((param) =>
            Promise.resolve({
              items: [
                {
                  fields: memberFields,
                },
              ],
            }),
          ),
        },
      },
    } as unknown as jest.Mocked<FieldExtensionSDK>;
    (useSDK as jest.Mock).mockReturnValue(testSdk);

    render(<Field />);
    await waitFor(() => {
      expect(testSdk.field.setValue).toHaveBeenCalledWith('false');
    });
    expect(screen.getByText(DUPLICATE_MEMBERS_MESSAGE)).toBeInTheDocument();
  });

  it('displays message that membership list is valid when there are no warnings', async () => {
    render(<Field />);

    await waitFor(() => {
      expect(sdk.field.setValue).toHaveBeenCalledWith('true');
    });
    expect(
      await screen.findByText(VALID_ENTRY_MESSAGE)).toBeInTheDocument();
  });
});
