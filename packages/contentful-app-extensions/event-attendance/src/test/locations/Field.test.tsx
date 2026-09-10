import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import {
  MultipleEntryReferenceEditor,
  CustomEntityCardProps,
  useEntity,
} from '@contentful/field-editor-reference';
import { useSDK, useCMA, useAutoResizer } from '@contentful/react-apps-toolkit';
import Field, { CustomCard } from '../../locations/Field';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
  useCMA: jest.fn(),
  useAutoResizer: jest.fn(),
}));

jest.mock('@contentful/field-editor-reference', () => ({
  MultipleEntryReferenceEditor: jest.fn(),
  useEntity: jest.fn(),
}));

jest.mock('@contentful/field-editor-shared', () => ({
  entityHelpers: {
    getEntryStatus: jest.fn().mockReturnValue('published'),
  },
}));

const link = (id: string) => ({
  sys: { type: 'Link', linkType: 'Entry', id },
});

const mockBaseSdk = () => ({
  space: {
    unpublishEntry: jest.fn(),
    deleteEntry: jest.fn(),
  },
  field: {
    getValue: jest.fn().mockReturnValue([]),
    setValue: jest.fn(),
  },
  dialogs: {
    selectSingleEntry: jest.fn(),
  },
  notifier: {
    success: jest.fn(),
    error: jest.fn(),
  },
  parameters: { instance: {} },
});

describe('Field component', () => {
  let sdk: jest.Mocked<FieldExtensionSDK>;
  let cma: {
    entry: {
      get: jest.Mock;
      create: jest.Mock;
      publish: jest.Mock;
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    sdk = mockBaseSdk() as unknown as jest.Mocked<FieldExtensionSDK>;
    cma = {
      entry: {
        get: jest.fn(),
        create: jest.fn(),
        publish: jest.fn(),
      },
    };
    (useSDK as jest.Mock).mockReturnValue(sdk);
    (useCMA as jest.Mock).mockReturnValue(cma);
    (MultipleEntryReferenceEditor as jest.Mock).mockImplementation(() => (
      <p>MultipleEntryReferenceEditor</p>
    ));
  });

  it('enables automatic resizing', () => {
    render(<Field />);
    expect(useAutoResizer).toHaveBeenCalled();
  });

  it('passes a custom card renderer to <MultipleEntryReferenceEditor />', () => {
    render(<Field />);
    expect(MultipleEntryReferenceEditor).toHaveBeenCalled();
    expect(
      (MultipleEntryReferenceEditor as jest.Mock).mock.lastCall[0]
        .renderCustomCard,
    ).toEqual(CustomCard);
  });

  describe('CustomCard', () => {
    beforeEach(() => {
      (useEntity as jest.Mock).mockImplementation((_type, id) => {
        if (id === 'team-1') {
          return { data: { fields: { displayName: { 'en-US': 'My Team' } } } };
        }
        if (id === 'ig-1') {
          return { data: { fields: { name: { 'en-US': 'My Group' } } } };
        }
        return { data: undefined };
      });
    });

    const cardProps = (fields: Record<string, unknown>) =>
      ({
        entity: {
          fields,
          sys: { type: 'Entry', publishedVersion: 1, version: 1 },
        },
        onEdit: jest.fn(),
        onRemove: jest.fn(),
      }) as unknown as CustomEntityCardProps;

    it('renders the team name and attended status', async () => {
      render(
        <CustomCard
          {...cardProps({
            team: { 'en-US': link('team-1') },
            attended: { 'en-US': true },
          })}
        />,
      );
      expect(await screen.findByText('My Team')).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('renders the interest group origin badge when present', async () => {
      render(
        <CustomCard
          {...cardProps({
            team: { 'en-US': link('team-1') },
            attended: { 'en-US': false },
            interestGroup: { 'en-US': link('ig-1') },
          })}
        />,
      );
      expect(await screen.findByText('My Team')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
      expect(screen.getByText('From My Group')).toBeInTheDocument();
    });

    it('shows an error when no team is selected', async () => {
      render(<CustomCard {...cardProps({ team: null })} />);
      expect(await screen.findByText('No team selected')).toBeInTheDocument();
    });

    it('unpublishes and deletes the entry on remove', async () => {
      const props = cardProps({ team: null });
      render(<CustomCard {...props} />);
      await screen.findByText('No team selected');
      fireEvent.click(screen.getByLabelText('Actions'));
      fireEvent.click(screen.getByText('Remove'));
      await waitFor(() => {
        expect(sdk.space.unpublishEntry).toHaveBeenCalledWith(props.entity);
        expect(sdk.space.deleteEntry).toHaveBeenCalledWith(props.entity);
        expect(props.onRemove).toHaveBeenCalled();
      });
    });
  });

  describe('Add interest group', () => {
    beforeEach(() => {
      (useEntity as jest.Mock).mockReturnValue({ data: undefined });
      sdk.dialogs.selectSingleEntry = jest.fn().mockResolvedValue({
        sys: { id: 'ig-1' },
        fields: { name: { 'en-US': 'My Group' } },
      });
      cma.entry.get.mockImplementation(({ entryId }) => {
        if (entryId === 'ig-1') {
          return Promise.resolve({
            fields: { teams: { 'en-US': [link('join-1'), link('join-2')] } },
          });
        }
        if (entryId === 'join-1') {
          return Promise.resolve({
            fields: { team: { 'en-US': link('team-1') } },
          });
        }
        if (entryId === 'join-2') {
          return Promise.resolve({
            fields: { team: { 'en-US': link('team-2') } },
          });
        }
        if (entryId === 'existing-att') {
          return Promise.resolve({
            fields: { team: { 'en-US': link('team-1') } },
          });
        }
        return Promise.resolve({ fields: {} });
      });
      cma.entry.create.mockImplementation((_ids, data) =>
        Promise.resolve({ ...data, sys: { id: 'created-1' } }),
      );
      cma.entry.publish.mockResolvedValue({});
    });

    it('creates attendance entries for new teams and skips existing ones', async () => {
      // team-1 is already in the field via an existing attendance entry.
      (sdk.field.getValue as jest.Mock).mockReturnValue([link('existing-att')]);

      render(<Field />);
      fireEvent.click(screen.getByText('Add interest group'));

      await waitFor(() => {
        expect(cma.entry.create).toHaveBeenCalledTimes(1);
      });
      const createdFields = cma.entry.create.mock.calls[0][1].fields;
      expect(createdFields.team['en-US'].sys.id).toBe('team-2');
      expect(createdFields.interestGroup['en-US'].sys.id).toBe('ig-1');
      expect(createdFields.attended['en-US']).toBe(false);

      expect(sdk.field.setValue).toHaveBeenCalledWith([
        link('existing-att'),
        link('created-1'),
      ]);
      expect(sdk.notifier.success).toHaveBeenCalledWith(
        'Added 1 team(s) from My Group. 1 already in the list.',
      );
    });

    it('does nothing when the dialog is dismissed', async () => {
      sdk.dialogs.selectSingleEntry = jest.fn().mockResolvedValue(null);
      render(<Field />);
      fireEvent.click(screen.getByText('Add interest group'));
      await waitFor(() => {
        expect(sdk.dialogs.selectSingleEntry).toHaveBeenCalled();
      });
      expect(cma.entry.create).not.toHaveBeenCalled();
      expect(sdk.field.setValue).not.toHaveBeenCalled();
    });
  });
});
