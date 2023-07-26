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

const capitalizeFirstLetter = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

type CustomEntryCardProps = CustomEntityCardProps & { entity: Entry };
type CardProps = {
  actions: EntryCardProps['actions'];
  onClick: CustomEntityCardProps['onEdit'];
  status: EntityStatus;
};
type MembershipCardProps = {
  entityName: string;
  showUserEmail: boolean;
  id: string;
  role?: string;
  workstreamRole?: string;
  inactiveSince?: string;
} & CardProps;

const MembershipCard = ({
  entityName,
  showUserEmail,
  id,
  actions,
  inactiveSince,
  role,
  workstreamRole,
  onClick,
  status,
}: MembershipCardProps) => {
  const { data } = useEntity<Entry>('Entry', id);
  if (!data) {
    return <EntryCard isLoading />;
  }

  const getEntityDisplayName = () => {
    switch (entityName) {
      case 'user':
        return `${data.fields.firstName?.['en-US']} ${data.fields.lastName?.['en-US']}`;
      case 'team':
        return data.fields.displayName?.['en-US'];
      case 'contributingCohort':
        return data.fields.name?.['en-US'];
      default:
        throw new Error('Unknown entity');
    }
  };

  return (
    <EntryCard
      contentType={capitalizeFirstLetter(entityName)}
      actions={actions}
      onClick={onClick}
      status={status}
    >
      <Heading marginBottom="none">{getEntityDisplayName()}</Heading>
      {entityName === 'user' &&
        showUserEmail &&
        data.fields.email?.['en-US'] && (
          <Paragraph marginBottom="none">
            {data.fields.email?.['en-US']}
          </Paragraph>
        )}
      {role && <Paragraph marginBottom="none">{role}</Paragraph>}
      {workstreamRole && (
        <Paragraph marginBottom="none">{workstreamRole}</Paragraph>
      )}
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

const MissingMembershipCard = ({
  entityName,
  actions,
  onClick,
  status,
}: { entityName: string } & CardProps) => (
  <EntryCard
    contentType={capitalizeFirstLetter(entityName)}
    actions={actions}
    onClick={onClick}
    status={status}
  >
    <Text fontColor="colorNegative">{`No ${entityName} selected`}</Text>
  </EntryCard>
);

type ParameterInstance = {
  entityName: string;
  showUserEmail: boolean;
};

const Card = ({ entity, onEdit, onRemove }: CustomEntryCardProps) => {
  const sdk = useSDK<FieldExtensionSDK>();
  const { fields, sys } = entity;
  const { entityName, showUserEmail } = sdk.parameters
    .instance as ParameterInstance;
  const entityId = fields[entityName]?.['en-US'].sys.id;
  const role = fields.role?.['en-US'];
  const workstreamRole = fields.workstreamRole?.['en-US'];
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
    contentType: capitalizeFirstLetter(entityName),
    actions: [
      <MenuItem key="remove" onClick={removeMembership}>
        Remove
      </MenuItem>,
    ],
    status,
    onClick: onEdit,
  };

  return entityId ? (
    <MembershipCard
      {...defaultProps}
      entityName={entityName}
      showUserEmail={showUserEmail}
      id={entityId}
      role={role}
      workstreamRole={workstreamRole}
      inactiveSince={inactiveSince}
    />
  ) : (
    <MissingMembershipCard entityName={entityName} {...defaultProps} />
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
