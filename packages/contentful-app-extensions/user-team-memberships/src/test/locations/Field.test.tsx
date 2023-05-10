import '@testing-library/jest-dom';
import React, { useState } from 'react';
import Field, { CustomCard } from '../../locations/Field';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
        if (id === 'team-1') {
          return {
            data: {
              fields: {
                displayName: {
                  'en-US': 'My Team',
                },
              },
            },
          };
        }
      });
    });

    it('loads team name from related entity and renders team name and role', async () => {
      const props = {
        entity: {
          fields: {
            role: {
              'en-US': 'Project Manager',
            },
            team: {
              'en-US': {
                sys: {
                  id: 'team-1',
                },
              },
            },
            inactiveSinceDate: null,
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
        expect(useEntity).toHaveBeenCalledWith('Entry', 'team-1');
        expect(screen.getByText('My Team')).toBeInTheDocument();
        expect(screen.getByText('Project Manager')).toBeInTheDocument();
      });
    });

    it('adds an "inactive" badge if usr is inactive in the team', async () => {
      const props = {
        entity: {
          fields: {
            role: {
              'en-US': 'Project Manager',
            },
            team: {
              'en-US': {
                sys: {
                  id: 'team-1',
                },
              },
            },
            inactiveSinceDate: {
              'en-US': '2020-01-01T12:00:00.000Z',
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
        expect(useEntity).toHaveBeenCalledWith('Entry', 'team-1');
        expect(screen.getByText('My Team')).toBeInTheDocument();
        expect(screen.getByText(/^Inactive since/)).toBeInTheDocument();
        expect(screen.getByText('Project Manager')).toBeInTheDocument();
      });
    });

    it('displays an error message if no team is selected', async () => {
      const props = {
        entity: {
          fields: {
            role: {
              'en-US': 'Project Manager',
            },
            team: null,
            inactiveSinceDate: null,
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
        expect(screen.getByText('No team selected')).toBeInTheDocument();
      });
    });

    it('calls the `onEdit` handler in contentful to open the related entity when clicked', async () => {
      const props = {
        entity: {
          fields: {
            role: null,
            team: null,
            inactiveSinceDate: null,
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
        expect(screen.getByText('No team selected')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('No team selected'));
      await waitFor(() => {
        expect(props.onEdit).toHaveBeenCalled();
      });
    });

    it('renders a remove button in the card menu', async () => {
      const props = {
        entity: {
          fields: {
            role: null,
            team: null,
            inactiveSinceDate: null,
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
        expect(screen.getByText('No team selected')).toBeInTheDocument();
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
            team: null,
            inactiveSinceDate: null,
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
        expect(screen.getByText('No team selected')).toBeInTheDocument();
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
            team: null,
            inactiveSinceDate: null,
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
        expect(screen.getByText('No team selected')).toBeInTheDocument();
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
