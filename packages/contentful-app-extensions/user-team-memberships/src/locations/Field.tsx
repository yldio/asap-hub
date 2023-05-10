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
  Badge,
  Heading,
  Paragraph,
  Text,
  EntityStatus,
  EntryCardProps,
  Box,
  formatRelativeDateTime,
} from '@contentful/f36-components';
import { FieldExtensionSDK, Entry } from '@contentful/app-sdk';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';

type CustomEntryCardProps = CustomEntityCardProps & { entity: Entry };
type CardProps = {
  actions: EntryCardProps['actions'];
  onClick: CustomEntityCardProps['onEdit'];
  status: EntityStatus;
};
type TeamCardProps = {
  id: string;
  role: string;
  inactiveSince?: string;
} & CardProps;

const TeamCard = ({
  id,
  actions,
  inactiveSince,
  role,
  onClick,
  status,
}: TeamCardProps) => {
  const { data: team } = useEntity<Entry>('Entry', id);
  if (!team) {
    return <EntryCard isLoading />;
  }
  return (
    <EntryCard
      contentType="Team"
      actions={actions}
      onClick={onClick}
      status={status}
    >
      <Heading marginBottom="none">
        {team.fields.displayName?.['en-US']}
      </Heading>
      <Paragraph marginBottom="none">{role}</Paragraph>
      {inactiveSince && (
        <Box display="inline">
          <Badge variant="secondary">
            Inactive since {formatRelativeDateTime(inactiveSince)}
          </Badge>
        </Box>
      )}
    </EntryCard>
  );
};

const MissingTeamCard = ({ actions, onClick, status }: CardProps) => (
  <EntryCard
    contentType="Team"
    actions={actions}
    onClick={onClick}
    status={status}
  >
    <Text fontColor="colorNegative">No team selected</Text>
  </EntryCard>
);

const Card = ({ entity, onEdit, onRemove }: CustomEntryCardProps) => {
  const sdk = useSDK<FieldExtensionSDK>();
  const { fields, sys } = entity;
  const teamId = fields.team?.['en-US'].sys.id;
  const role = fields.role?.['en-US'];
  const inactiveSince = fields.inactiveSinceDate?.['en-US'];
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
    contentType: 'Team',
    actions: [
      <MenuItem key="remove" onClick={removeMembership}>
        Remove
      </MenuItem>,
    ],
    status,
    onClick: onEdit,
  };

  return teamId ? (
    <TeamCard
      {...defaultProps}
      id={teamId}
      role={role}
      inactiveSince={inactiveSince}
    />
  ) : (
    <MissingTeamCard {...defaultProps} />
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
