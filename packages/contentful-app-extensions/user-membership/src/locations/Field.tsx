import React from 'react';
import {
  MultipleEntryReferenceEditor,
  CustomEntityCardProps,
  useEntity,
} from '@contentful/field-editor-reference';
import { entityHelpers } from '@contentful/field-editor-shared';
import {
  EntryCard,
  MenuItem,
  Heading,
  Paragraph,
  Text,
  EntityStatus,
  EntryCardProps,
} from '@contentful/f36-components';
import { FieldExtensionSDK, Entry } from '@contentful/app-sdk';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';

type CustomEntryCardProps = CustomEntityCardProps & { entity: Entry };
type CardProps = {
  actions: EntryCardProps['actions'];
  onClick: CustomEntityCardProps['onEdit'];
  status: EntityStatus;
};
type MemberCardProps = {
  id: string;
  role: string;
} & CardProps;

const MemberCard = ({
  id,
  actions,
  role,
  onClick,
  status,
}: MemberCardProps) => {
  const { data: user } = useEntity<Entry>('Entry', id);
  if (!user) {
    return <EntryCard isLoading />;
  }
  return (
    <EntryCard
      contentType="Member"
      actions={actions}
      onClick={onClick}
      status={status}
    >
      <Heading marginBottom="none">
        {user.fields.firstName?.['en-US']} {user.fields.lastName?.['en-US']}
      </Heading>
      <Paragraph marginBottom="none">{user.fields.email?.['en-US']}</Paragraph>
      <Paragraph marginBottom="none">{role}</Paragraph>
    </EntryCard>
  );
};

const MissingMemberCard = ({ actions, onClick, status }: CardProps) => (
  <EntryCard
    contentType="Member"
    actions={actions}
    onClick={onClick}
    status={status}
  >
    <Text fontColor="colorNegative">No member selected</Text>
  </EntryCard>
);

const Card = ({ entity, onEdit, onRemove }: CustomEntryCardProps) => {
  const sdk = useSDK();
  const { fields, sys } = entity;
  const userId = fields.user?.['en-US'].sys.id;
  const role = fields.role?.['en-US'];

  const removeMembership = async () => {
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
    contentType: 'user',
    actions: [
      <MenuItem key="remove" onClick={removeMembership}>
        Remove
      </MenuItem>,
    ],
    status,
    onClick: onEdit,
  };

  return userId ? (
    <MemberCard {...defaultProps} id={userId} role={role} />
  ) : (
    <MissingMemberCard {...defaultProps} />
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
