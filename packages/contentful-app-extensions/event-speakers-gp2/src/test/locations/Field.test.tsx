import '@testing-library/jest-dom';
import React, { useState } from 'react';
import Field, { CustomCard } from '../../locations/Field';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  queryByTestId,
} from '@testing-library/react';
import { FieldExtensionSDK, Entry } from '@contentful/app-sdk';
import {
  MultipleEntryReferenceEditor,
  CustomEntityCardProps,
  useEntity,
} from '@contentful/field-editor-reference';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
  useAutoResizer: jest.fn(),
}));

jest.mock('@contentful/field-editor-reference', () => ({
  MultipleEntryReferenceEditor: jest.fn(),
  useEntity: jest.fn(),
}));

const mockBaseSdk = () => ({
  window: {
    startAutoResizer: jest.fn(),
  },
  space: {
    unpublishEntry: jest.fn(),
    deleteEntry: jest.fn(),
  },
});

describe('Field component', () => {
  let sdk: jest.Mocked<FieldExtensionSDK>;

  beforeEach(() => {
    sdk = mockBaseSdk() as unknown as jest.Mocked<FieldExtensionSDK>;
    (useSDK as jest.Mock).mockReturnValue(sdk);
    (MultipleEntryReferenceEditor as jest.Mock).mockImplementation(() => (
      <p>MultipleEntryReferenceEditor</p>
    ));
  });

  it('enables automatic resizing', async () => {
    render(<Field />);
    expect(useAutoResizer).toHaveBeenCalled();
  });

  it('passes a custom card renderer to <MultipleEntryReferenceEditor />', async () => {
    render(<Field />);

    expect(MultipleEntryReferenceEditor).toHaveBeenCalled();
    expect(
      (MultipleEntryReferenceEditor as jest.Mock).mock.lastCall[0]
        .renderCustomCard,
    ).toEqual(CustomCard);
  });

  describe('CustomCard component', () => {
    beforeEach(() => {
      (useEntity as jest.Mock).mockImplementation((type, id) => {
        if (id === 'user-1') {
          return {
            data: {
              sys: {
                contentType: {
                  sys: {
                    id: 'users',
                  },
                },
              },
              fields: {
                firstName: {
                  'en-US': 'First',
                },
                lastName: {
                  'en-US': 'Last',
                },
              },
            },
          };
        }
        if (id === 'external-author-1') {
          return {
            data: {
              sys: {
                contentType: {
                  sys: {
                    id: 'externalAuthors',
                  },
                },
              },
              fields: {
                name: {
                  'en-US': 'External Speaker',
                },
              },
            },
          };
        }
      });
    });

    it('loads title from related entity and renders it', async () => {
      const props = {
        entity: {
          fields: {
            title: {
              'en-US': 'Topic 1',
            },
            user: null,
          },
          sys: {
            type: 'Entry',
            publishedVersion: 1,
            version: 1,
          },
        },
        onEdit: jest.fn(),
        onRemove: jest.fn(),
      } as unknown as CustomEntityCardProps;

      render(<CustomCard {...props} />);

      await waitFor(() => {
        expect(screen.queryByText('Topic 1')).toBeInTheDocument();
        expect(screen.queryByText('User')).not.toBeInTheDocument();
        expect(screen.queryByText('External Author')).not.toBeInTheDocument();
      });
    });

    it('loads user name from related entity and renders user name', async () => {
      const props = {
        entity: {
          fields: {
            title: null,
            user: {
              'en-US': {
                sys: {
                  id: 'user-1',
                },
              },
            },
          },
          sys: {
            type: 'Entry',
            publishedVersion: 1,
            version: 1,
          },
        },
        onEdit: jest.fn(),
        onRemove: jest.fn(),
      } as unknown as CustomEntityCardProps;

      render(<CustomCard {...props} />);

      await waitFor(() => {
        expect(useEntity).toHaveBeenCalledWith('Entry', 'user-1');
        expect(screen.queryByText('First Last')).toBeInTheDocument();
        expect(screen.queryByText('User')).toBeInTheDocument();
        expect(screen.queryByText('External Author')).not.toBeInTheDocument();
      });
    });

    it('loads external author name from related entity and renders external author name', async () => {
      const props = {
        entity: {
          fields: {
            team: null,
            user: {
              'en-US': {
                sys: {
                  id: 'external-author-1',
                },
              },
            },
          },
          sys: {
            type: 'Entry',
            publishedVersion: 1,
            version: 1,
          },
        },
        onEdit: jest.fn(),
        onRemove: jest.fn(),
      } as unknown as CustomEntityCardProps;

      render(<CustomCard {...props} />);

      await waitFor(() => {
        expect(useEntity).toHaveBeenCalledWith('Entry', 'external-author-1');
        expect(screen.queryByText('External Speaker')).toBeInTheDocument();
        expect(screen.queryByText('User')).not.toBeInTheDocument();
        expect(screen.queryByText('External Author')).toBeInTheDocument();
      });
    });

    it('calls the `onEdit` handler in contentful to open the related entity when clicked', async () => {
      const props = {
        entity: {
          fields: {
            team: null,
            user: null,
          },
          sys: {
            type: 'Entry',
            publishedVersion: 1,
            version: 1,
          },
        },
        onEdit: jest.fn(),
        onRemove: jest.fn(),
      } as unknown as CustomEntityCardProps;

      render(<CustomCard {...props} />);

      await waitFor(() => {
        expect(screen.getByText('No speakers selected')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('No speakers selected'));
      await waitFor(() => {
        expect(props.onEdit).toHaveBeenCalled();
      });
    });

    it('renders a remove button in the card menu', async () => {
      const props = {
        entity: {
          fields: {
            team: null,
            user: null,
          },
          sys: {
            type: 'Entry',
            publishedVersion: 1,
            version: 1,
          },
        },
        onEdit: jest.fn(),
        onRemove: jest.fn(),
      } as unknown as CustomEntityCardProps;

      render(<CustomCard {...props} />);

      await waitFor(() => {
        expect(screen.getByText('No speakers selected')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText('Actions'));
      await waitFor(() => {
        expect(screen.getByText('Remove')).toBeVisible();
      });
    });

    it('unpublishes and deletes the entry when the remove button is clicked', async () => {
      const props = {
        entity: {
          fields: {
            team: null,
            user: null,
          },
          sys: {
            type: 'Entry',
            publishedVersion: 1,
            version: 1,
          },
        },
        onEdit: jest.fn(),
        onRemove: jest.fn(),
      } as unknown as CustomEntityCardProps;

      render(<CustomCard {...props} />);

      await waitFor(() => {
        expect(screen.getByText('No speakers selected')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText('Actions'));
      fireEvent.click(screen.getByText('Remove'));
      await waitFor(() => {
        expect(sdk.space.unpublishEntry).toHaveBeenCalledWith(props.entity);
        expect(sdk.space.deleteEntry).toHaveBeenCalledWith(props.entity);
        expect(props.onRemove).toHaveBeenCalled();
      });
    });

    it('does not unpublish the entry when the remove button is clicked if the entry is unpublished', async () => {
      const props = {
        entity: {
          fields: {
            team: null,
            user: null,
          },
          sys: {
            type: 'Entry',
            version: 1,
          },
        },
        onEdit: jest.fn(),
        onRemove: jest.fn(),
      } as unknown as CustomEntityCardProps;

      render(<CustomCard {...props} />);

      await waitFor(() => {
        expect(screen.getByText('No speakers selected')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText('Actions'));
      fireEvent.click(screen.getByText('Remove'));
      await waitFor(() => {
        expect(sdk.space.deleteEntry).toHaveBeenCalledWith(props.entity);
        expect(props.onRemove).toHaveBeenCalled();
        expect(sdk.space.unpublishEntry).not.toHaveBeenCalled();
      });
    });
  });
});
