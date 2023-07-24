import React from 'react';
import {
  MultipleEntryReferenceEditor,
  CustomEntityCardProps,
} from '@contentful/field-editor-reference';
import { entityHelpers } from '@contentful/field-editor-shared';
import {
  EntryCard,
  MenuItem,
  Badge,
  Paragraph,
  BadgeVariant,
} from '@contentful/f36-components';
import { FieldExtensionSDK, Entry } from '@contentful/app-sdk';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';

export const CustomCard = ({
  entity,
  onEdit,
  onRemove,
}: CustomEntityCardProps) => {
  const entry = entity as Entry;
  const sdk = useSDK<FieldExtensionSDK>();
  const { fields, sys } = entity as Entry;
  const description = fields.description?.['en-US'];
  const deliverableStatus = fields.status?.['en-US'];

  const removeEntry = async () => {
    if (sys.publishedVersion) {
      await sdk.space.unpublishEntry(entry);
    }
    await sdk.space.deleteEntry(entry);
    if (onRemove) {
      onRemove();
    }
  };

  const status = entityHelpers.getEntryStatus(sys);

  const badgeVariant: { [status: string]: BadgeVariant } = {
    Complete: 'positive',
    Incomplete: 'negative',
    'In Progress': 'featured',
    Pending: 'primary',
    'Not Started': 'secondary',
  };
  return (
    <EntryCard
      contentType="Deliverable"
      actions={[
        <MenuItem key="remove" onClick={removeEntry}>
          Remove
        </MenuItem>,
      ]}
      status={status}
      onClick={onEdit}
    >
      <>
        <Paragraph marginBottom="none">Description: {description}</Paragraph>
        <Paragraph marginBottom="none">
          Deliverable status:{' '}
          <Badge
            variant={badgeVariant[deliverableStatus] || 'primary'}
            style={{ width: 'fit-content' }}
            testId={badgeVariant[deliverableStatus]}
          >
            {deliverableStatus}
          </Badge>
        </Paragraph>
      </>
    </EntryCard>
  );
};

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  useAutoResizer();

  return (
    <MultipleEntryReferenceEditor
      isInitiallyDisabled={false}
      hasCardEditActions={true}
      renderCustomCard={CustomCard}
      parameters={{
        instance: {
          showLinkEntityAction: false,
          showCreateEntityAction: true,
          bulkEditing: false,
        },
      }}
      viewType="link"
      sdk={sdk}
      actionLabels={{
        createNew: () => 'Add',
      }}
    />
  );
};

export default Field;
