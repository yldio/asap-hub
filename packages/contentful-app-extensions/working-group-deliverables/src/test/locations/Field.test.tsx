import '@testing-library/jest-dom';
import React from 'react';
import Field, { CustomCard } from '../../locations/Field';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { FieldExtensionSDK, Entry } from '@contentful/app-sdk';
import {
  MultipleEntryReferenceEditor,
  CustomEntityCardProps,
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
  let cardProps: CustomEntityCardProps;

  beforeEach(() => {
    sdk = mockBaseSdk() as unknown as jest.Mocked<FieldExtensionSDK>;
    (useSDK as jest.Mock).mockReturnValue(sdk);
    (MultipleEntryReferenceEditor as jest.Mock).mockImplementation(() => (
      <p>MultipleEntryReferenceEditor</p>
    ));

    cardProps = {
      entity: {
        fields: {
          description: {
            'en-US': 'Deliverable 1',
          },
          status: {
            'en-US': 'Complete',
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

  it('renders deliverable description and status', async () => {
    render(<CustomCard {...cardProps} />);
    expect(screen.getByText('Description: Deliverable 1')).toBeInTheDocument();
    expect(screen.getByText('Deliverable status:')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('calls the `onEdit` handler in contentful to open the related entity when clicked', async () => {
    render(<CustomCard {...cardProps} />);

    fireEvent.click(screen.getByText('Description: Deliverable 1'));
    await waitFor(() => {
      expect(cardProps.onEdit).toHaveBeenCalled();
    });
  });

  it('renders a remove button in the card menu', async () => {
    render(<CustomCard {...cardProps} />);

    fireEvent.click(screen.getByLabelText('Actions'));
    await waitFor(() => {
      expect(screen.getByText('Remove')).toBeVisible();
    });
  });

  it('unpublishes and deletes the entry when the remove button is clicked', async () => {
    render(<CustomCard {...cardProps} />);

    fireEvent.click(screen.getByLabelText('Actions'));
    fireEvent.click(screen.getByText('Remove'));
    await waitFor(() => {
      expect(sdk.space.unpublishEntry).toHaveBeenCalledWith(cardProps.entity);
      expect(sdk.space.deleteEntry).toHaveBeenCalledWith(cardProps.entity);
      expect(cardProps.onRemove).toHaveBeenCalled();
    });
  });

  it('does not unpublish the entry when the remove button is clicked if the entry is unpublished', async () => {
    const props = {
      ...cardProps,
      entity: {
        ...cardProps.entity,
        sys: {
          type: 'Entry',
          version: 1,
        },
      } as Entry,
    };

    render(<CustomCard {...props} />);

    fireEvent.click(screen.getByLabelText('Actions'));
    fireEvent.click(screen.getByText('Remove'));
    await waitFor(() => {
      expect(sdk.space.deleteEntry).toHaveBeenCalledWith(props.entity);
      expect(props.onRemove).toHaveBeenCalled();
      expect(sdk.space.unpublishEntry).not.toHaveBeenCalled();
    });
  });
});
