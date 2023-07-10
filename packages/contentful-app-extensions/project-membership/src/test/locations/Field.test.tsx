import '@testing-library/jest-dom';
import React from 'react';
import Field, { CustomCard } from '../../locations/Field';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
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
              fields: {
                firstName: {
                  'en-US': 'First',
                },
                lastName: {
                  'en-US': 'Member',
                },
                email: {
                  'en-US': 'user@test.com',
                },
              },
            },
          };
        }
      });
    });

    it('loads user name and email from related entity and renders user name, role and email', async () => {
      const props = {
        entity: {
          fields: {
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
        expect(screen.getByText('First Member')).toBeInTheDocument();
        expect(screen.getByText('user@test.com')).toBeInTheDocument();
        expect(screen.getByText('Project Manager')).toBeInTheDocument();
      });
    });

    it('displays an error message if no user is selected', async () => {
      const props = {
        entity: {
          fields: {
            role: {
              'en-US': 'Project Manager',
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
        expect(screen.getByText('No member selected')).toBeInTheDocument();
      });
    });

    it('calls the `onEdit` handler in contentful to open the related entity when clicked', async () => {
      const props = {
        entity: {
          fields: {
            role: null,
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
        expect(screen.getByText('No member selected')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('No member selected'));
      await waitFor(() => {
        expect(props.onEdit).toHaveBeenCalled();
      });
    });

    it('renders a remove button in the card menu', async () => {
      const props = {
        entity: {
          fields: {
            role: null,
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
        expect(screen.getByText('No member selected')).toBeInTheDocument();
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
            role: null,
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
        expect(screen.getByText('No member selected')).toBeInTheDocument();
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
            role: null,
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
        expect(screen.getByText('No member selected')).toBeInTheDocument();
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
