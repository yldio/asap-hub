import React from 'react';
import {
  MultipleEntryReferenceEditor,
  CustomEntityCardProps,
  useEntity,
} from '@contentful/field-editor-reference';
import { entityHelpers } from '@contentful/field-editor-shared';
import { EntryCard, MenuItem, Text, Badge } from '@contentful/f36-components';
import { FieldExtensionSDK, Entry } from '@contentful/app-sdk';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';

type CustomEntryCardProps = CustomEntityCardProps & { entity: Entry };

const UserTitle = ({ id }: { id: string }) => {
  const { data: user } = useEntity<Entry>('Entry', id);
  const contentType = user?.sys?.contentType?.sys?.id;

  if (contentType === 'users') {
    const name = `${user.fields?.firstName?.['en-US']} ${user.fields?.lastName?.['en-US']}`;
    return (
      <>
        {name} <Badge>User</Badge>
      </>
    );
  }
  if (contentType === 'externalAuthors') {
    return (
      <>
        {user.fields?.name?.['en-US']} <Badge>External Author</Badge>
      </>
    );
  }
  return null;
};

const Card = ({ entity, onEdit, onRemove }: CustomEntryCardProps) => {
  const sdk = useSDK<FieldExtensionSDK>();
  const { fields, sys } = entity;
  const title = fields.title?.['en-US'];
  const userId = fields.user?.['en-US'].sys.id;

  const removeSpeaker = async () => {
    if (sys.publishedVersion) {
      await sdk.space.unpublishEntry(entity);
    }
    await sdk.space.deleteEntry(entity);
    if (onRemove) {
      onRemove();
    }
  };

  const status = entityHelpers.getEntryStatus(sys);

  const defaultProps = {
    contentType: 'Speaker',
    actions: [
      <MenuItem key="remove" onClick={removeSpeaker}>
        Remove
      </MenuItem>,
    ],
    status,
    onClick: onEdit,
  };

  return (
    <EntryCard {...defaultProps}>
      {!title && !userId && (
        <Text fontColor="colorNegative">No speakers selected</Text>
      )}

      {userId && (
        <Text>
          <UserTitle id={userId} />
        </Text>
      )}
      {title && <Text>{title}</Text>}
    </EntryCard>
  );
};

export const CustomCard = ({ entity, ...props }: CustomEntityCardProps) => (
  <Card {...props} entity={entity as Entry} />
);

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
