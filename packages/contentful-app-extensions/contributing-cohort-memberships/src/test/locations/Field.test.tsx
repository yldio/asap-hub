import '@testing-library/jest-dom';
import React, { useState } from 'react';
import Field, { CustomCard } from '../../locations/Field';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
        if (id === 'contributing-cohort-1') {
          return {
            data: {
              fields: {
                name: {
                  'en-US': 'My Contributing Cohort',
                },
              },
            },
          };
        }
      });
    });

    it('loads contributing cohort name from related entity and renders contributing cohort name and role', async () => {
      const props = {
        entity: {
          fields: {
            role: {
              'en-US': 'Lead',
            },
            contributingCohort: {
              'en-US': {
                sys: {
                  id: 'contributing-cohort-1',
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

      expect(useEntity).toHaveBeenCalledWith('Entry', 'contributing-cohort-1');
      expect(
        await screen.findByText('My Contributing Cohort'),
      ).toBeInTheDocument();
      expect(await screen.findByText('Lead')).toBeInTheDocument();
    });

    it('displays an error message if no contributing cohort is selected', async () => {
      const props = {
        entity: {
          fields: {
            role: {
              'en-US': 'Project Manager',
            },
            contributingCohort: null,
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

      expect(
        await screen.findByText('No contributing cohort selected'),
      ).toBeInTheDocument();
    });

    it('calls the `onEdit` handler in contentful to open the related entity when clicked', async () => {
      const props = {
        entity: {
          fields: {
            role: null,
            contributingCohort: null,
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

      expect(
        await screen.findByText('No contributing cohort selected'),
      ).toBeInTheDocument();

      userEvent.click(screen.getByText('No contributing cohort selected'));
      await waitFor(() => {
        expect(props.onEdit).toHaveBeenCalled();
      });
    });

    it('renders a remove button in the card menu', async () => {
      const props = {
        entity: {
          fields: {
            role: null,
            contributingCohort: null,
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

      expect(
        await screen.findByText('No contributing cohort selected'),
      ).toBeInTheDocument();
      userEvent.click(screen.getByLabelText('Actions'));
      expect(
        await screen.findByRole('menuitem', { name: /remove/i }),
      ).toBeVisible();
    });

    it('unpublishes and deletes the entry when the remove button is clicked', async () => {
      const props = {
        entity: {
          fields: {
            role: null,
            contributingCohort: null,
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

      expect(
        await screen.findByText('No contributing cohort selected'),
      ).toBeInTheDocument();
      userEvent.click(screen.getByLabelText('Actions'));
      userEvent.click(screen.getByText('Remove'));
      await waitFor(() => {
        expect(sdk.space.unpublishEntry).toHaveBeenCalledWith(props.entity);
      });
      await waitFor(() => {
        expect(sdk.space.deleteEntry).toHaveBeenCalledWith(props.entity);
      });
      await waitFor(() => {
        expect(props.onRemove).toHaveBeenCalled();
      });
    });

    it('does not unpublish the entry when the remove button is clicked if the entry is unpublished', async () => {
      const props = {
        entity: {
          fields: {
            role: null,
            contributingCohort: null,
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

      expect(
        await screen.findByText('No contributing cohort selected'),
      ).toBeInTheDocument();

      userEvent.click(screen.getByLabelText('Actions'));
      userEvent.click(screen.getByText('Remove'));

      await waitFor(() => {
        expect(sdk.space.deleteEntry).toHaveBeenCalledWith(props.entity);
      });
      await waitFor(() => {
        expect(props.onRemove).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(sdk.space.unpublishEntry).not.toHaveBeenCalled();
      });
    });
  });
});
