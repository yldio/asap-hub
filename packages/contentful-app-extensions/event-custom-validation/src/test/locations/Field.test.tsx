import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import Field, {
  VALID_ENTRY_MESSAGE,
  DUPLICATE_SPEAKERS_MESSAGE,
  EMPTY_SPEAKER_MESSAGE,
  EXTERNAL_AUTHOR_WITH_TEAM_MESSAGE,
} from '../../locations/Field';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
  useAutoResizer: jest.fn(),
}));

const speakerFields = {
  team: {
    'en-US': {
      sys: {
        id: 'team-1',
      },
    },
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
      speakers: {
        id: 'speakers',
        onValueChanged: jest.fn(() => unsubscribeFn),
        getValue: jest.fn(() => [
          {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: 'speaker-link-1',
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
              fields: speakerFields,
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
          fields: {
            teams: {
              'en-US': [{ sys: { id: 'team-1' } }],
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

  it('displays message that entry is valid when there are no validation errors', async () => {
    render(<Field />);
    await waitFor(() => {
      expect(screen.getByText(VALID_ENTRY_MESSAGE)).toBeInTheDocument();
      expect(screen.queryByText(DUPLICATE_SPEAKERS_MESSAGE)).toBeNull();
      expect(screen.queryByText(EXTERNAL_AUTHOR_WITH_TEAM_MESSAGE)).toBeNull();
      expect(screen.queryByText(EMPTY_SPEAKER_MESSAGE)).toBeNull();
    });
  });

  it('displays error message when there is a speaker without user or team', async () => {
    const testSdk = {
      ...mockBaseSdk(),
      cma: {
        entry: {
          getMany: jest.fn(() =>
            Promise.resolve({
              items: [
                {
                  fields: {
                    team: null,
                    user: null,
                  },
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
      expect(screen.getByText(EMPTY_SPEAKER_MESSAGE)).toBeInTheDocument();
      expect(screen.queryByText(VALID_ENTRY_MESSAGE)).toBeNull();
    });
  });

  it('displays error message when there are duplicated speakers', async () => {
    const baseSdk = mockBaseSdk();
    const testSdk = {
      ...baseSdk,
      cma: {
        entry: {
          ...baseSdk.cma.entry,
          getMany: jest.fn(() =>
            Promise.resolve({
              items: [
                {
                  fields: speakerFields,
                },
                {
                  fields: speakerFields,
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
      expect(screen.getByText(DUPLICATE_SPEAKERS_MESSAGE)).toBeInTheDocument();
      expect(screen.queryByText(VALID_ENTRY_MESSAGE)).toBeNull();
    });
  });

  it('displays error message when there are external authors associated to a team', async () => {
    const baseSdk = mockBaseSdk();
    const testSdk = {
      ...baseSdk,
      cma: {
        entry: {
          getMany: jest.fn(() =>
            Promise.resolve({
              items: [
                {
                  fields: speakerFields,
                },
              ],
            }),
          ),
          get: jest.fn(() =>
            Promise.resolve({
              sys: {
                contentType: {
                  sys: {
                    id: 'externalAuthors',
                  },
                },
              },
            }),
          ),
        },
      },
    } as unknown as jest.Mocked<FieldExtensionSDK>;
    (useSDK as jest.Mock).mockReturnValue(testSdk);

    render(<Field />);
    await waitFor(() => {
      expect(
        screen.getByText(EXTERNAL_AUTHOR_WITH_TEAM_MESSAGE),
      ).toBeInTheDocument();
      expect(screen.queryByText(VALID_ENTRY_MESSAGE)).toBeNull();
    });
  });

  it('displays more than one validation message error at a time', async () => {
    const baseSdk = mockBaseSdk();
    const testSdk = {
      ...baseSdk,
      cma: {
        entry: {
          getMany: jest.fn(() =>
            Promise.resolve({
              items: [
                {
                  fields: speakerFields,
                },
                {
                  fields: {
                    team: null,
                    user: null,
                  },
                },
              ],
            }),
          ),
          get: jest.fn(() =>
            Promise.resolve({
              sys: {
                contentType: {
                  sys: {
                    id: 'externalAuthors',
                  },
                },
              },
            }),
          ),
        },
      },
    } as unknown as jest.Mocked<FieldExtensionSDK>;
    (useSDK as jest.Mock).mockReturnValue(testSdk);

    render(<Field />);
    await waitFor(() => {
      expect(
        screen.getByText(EXTERNAL_AUTHOR_WITH_TEAM_MESSAGE),
      ).toBeInTheDocument();
      expect(screen.getByText(EMPTY_SPEAKER_MESSAGE)).toBeInTheDocument();
      expect(screen.queryByText(VALID_ENTRY_MESSAGE)).toBeNull();
    });
  });

  it('displays warning message when there is an user associated with a team that he/she does not belong', async () => {
    const baseSdk = mockBaseSdk();
    const testSdk = {
      ...baseSdk,
      cma: {
        entry: {
          getMany: jest.fn((param) => {
            if (param.query['sys.id[in]'][0] === 'speaker-link-1') {
              return Promise.resolve({
                items: [
                  {
                    fields: speakerFields,
                  },
                ],
              });
            }

            if (param.query['sys.id[in]'][0] === 'team-membership-1') {
              return Promise.resolve({
                items: [
                  {
                    fields: {
                      team: {
                        sys: {
                          id: 'team-2',
                        },
                      },
                    },
                  },
                ],
              });
            }
          }),
          get: jest.fn((param) => {
            if (param.entryId === 'user-1') {
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
                  teams: {
                    'en-US': [{ sys: { id: 'team-membership-1' } }],
                  },
                },
              });
            }

            if (param.entryId === 'team-1') {
              return Promise.resolve({
                fields: {
                  displayName: {
                    'en-US': 'Team One',
                  },
                },
              });
            }

            if (param.entryId === 'team-2') {
              return Promise.resolve({
                fields: {
                  displayName: {
                    'en-US': 'Team Two',
                  },
                },
              });
            }
          }),
        },
      },
    } as unknown as jest.Mocked<FieldExtensionSDK>;
    (useSDK as jest.Mock).mockReturnValue(testSdk);

    render(<Field />);
    await waitFor(() => {
      expect(screen.getByText(VALID_ENTRY_MESSAGE)).toBeInTheDocument();
      expect(
        screen.getByText('User John Doe does not belong to team Team One.'),
      ).toBeInTheDocument();
    });
  });
});
