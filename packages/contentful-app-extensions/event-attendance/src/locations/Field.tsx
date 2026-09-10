import React, { useState } from 'react';
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
  Button,
  Heading,
  Text,
  EntityStatus,
  EntryCardProps,
  Box,
  Stack,
  formatRelativeDateTime,
} from '@contentful/f36-components';
import { FieldExtensionSDK, Entry, Link } from '@contentful/app-sdk';
import {
  useSDK,
  useCMA,
  useAutoResizer,
} from '@contentful/react-apps-toolkit';

const LOCALE = 'en-US';

const entryLink = (id: string): Link => ({
  sys: { type: 'Link', linkType: 'Entry', id },
});

const InterestGroupBadge = ({ id }: { id: string }) => {
  const { data } = useEntity<Entry>('Entry', id);
  const name = data?.fields.name?.[LOCALE];
  return name ? (
    <Box display="inline">
      <Badge variant="primary">From {name}</Badge>
    </Box>
  ) : null;
};

type CardProps = {
  actions: EntryCardProps['actions'];
  onClick: CustomEntityCardProps['onEdit'];
  status: EntityStatus;
};

type AttendanceCardProps = {
  attended: boolean | null;
  teamId: string;
  interestGroupId?: string;
  inactiveSince?: string;
} & CardProps;

const AttendanceCard = ({
  attended,
  teamId,
  interestGroupId,
  inactiveSince,
  actions,
  onClick,
  status,
}: AttendanceCardProps) => {
  const { data } = useEntity<Entry>('Entry', teamId);
  if (!data) {
    return <EntryCard isLoading />;
  }

  return (
    <EntryCard
      contentType="Attendance"
      actions={actions}
      onClick={onClick}
      status={status}
    >
      <Heading marginBottom="none">{data.fields.displayName?.[LOCALE]}</Heading>
      {attended !== null && (
        <Text as="p">{attended ? 'Yes' : 'No'}</Text>
      )}
      <Stack spacing="spacingXs" marginTop="spacingXs">
        {interestGroupId && <InterestGroupBadge id={interestGroupId} />}
        {inactiveSince && (
          <Box display="inline">
            <Badge variant="secondary">
              Inactive since {formatRelativeDateTime(inactiveSince)}
            </Badge>
          </Box>
        )}
      </Stack>
    </EntryCard>
  );
};

const MissingAttendanceCard = ({ actions, onClick, status }: CardProps) => (
  <EntryCard
    contentType="Attendance"
    actions={actions}
    onClick={onClick}
    status={status}
  >
    <Text fontColor="colorNegative">No team selected</Text>
  </EntryCard>
);

const Card = ({ entity, onEdit, onRemove }: CustomEntityCardProps) => {
  const sdk = useSDK<FieldExtensionSDK>();
  const { fields, sys } = entity as Entry;
  const teamId = fields.team?.[LOCALE]?.sys.id;
  const interestGroupId = fields.interestGroup?.[LOCALE]?.sys.id;
  const attended = fields.attended?.[LOCALE];
  const inactiveSince = fields.inactiveSinceDate?.[LOCALE];

  const removeMembership = async () => {
    if (sys.publishedVersion) {
      await sdk.space.unpublishEntry(entity as Entry);
    }
    await sdk.space.deleteEntry(entity as Entry);
    if (onRemove) {
      onRemove();
    }
  };

  const status = entityHelpers.getEntryStatus(sys);

  const defaultProps = {
    actions: [
      <MenuItem key="remove" onClick={removeMembership}>
        Remove
      </MenuItem>,
    ],
    status,
    onClick: onEdit,
  };

  return teamId ? (
    <AttendanceCard
      {...defaultProps}
      attended={attended ?? null}
      teamId={teamId}
      interestGroupId={interestGroupId}
      inactiveSince={inactiveSince}
    />
  ) : (
    <MissingAttendanceCard {...defaultProps} />
  );
};

export const CustomCard = ({ entity, ...props }: CustomEntityCardProps) => (
  <Card {...props} entity={entity as Entry} />
);

const getFieldLinks = (value: unknown): Link[] =>
  Array.isArray(value) ? (value as Link[]) : [];

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const cma = useCMA();
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  useAutoResizer();

  // Expand an interest group into one attendance entry per member team.
  // A team already present in the field is skipped so it keeps a single
  // attendance (the first interest group that contributed it wins).
  const addInterestGroup = async () => {
    setIsAddingGroup(true);
    try {
      const selected = await sdk.dialogs.selectSingleEntry<Entry>({
        contentTypes: ['interestGroups'],
      });
      if (!selected) {
        return;
      }
      const interestGroupId = selected.sys.id;
      const interestGroupName = selected.fields?.name?.[LOCALE] as
        | string
        | undefined;

      const interestGroup = await cma.entry.get({
        entryId: interestGroupId,
      });
      const joinLinks = getFieldLinks(interestGroup.fields.teams?.[LOCALE]);
      const joins = await Promise.all(
        joinLinks.map((link) => cma.entry.get({ entryId: link.sys.id })),
      );
      const teamIds = joins
        .map((join) => join.fields.team?.[LOCALE]?.sys?.id as string | undefined)
        .filter((id): id is string => Boolean(id));

      const currentLinks = getFieldLinks(sdk.field.getValue());
      const existingAttendance = await Promise.all(
        currentLinks.map((link) => cma.entry.get({ entryId: link.sys.id })),
      );
      const existingTeamIds = new Set(
        existingAttendance
          .map((entry) => entry.fields.team?.[LOCALE]?.sys?.id as string)
          .filter(Boolean),
      );

      const uniqueTeamIds = [...new Set(teamIds)];
      const newTeamIds = uniqueTeamIds.filter((id) => !existingTeamIds.has(id));

      const createdLinks: Link[] = [];
      for (const teamId of newTeamIds) {
        // eslint-disable-next-line no-await-in-loop
        const created = await cma.entry.create(
          { contentTypeId: 'attendance' },
          {
            fields: {
              team: { [LOCALE]: entryLink(teamId) },
              attended: { [LOCALE]: false },
              interestGroup: { [LOCALE]: entryLink(interestGroupId) },
            },
          },
        );
        // eslint-disable-next-line no-await-in-loop
        await cma.entry.publish({ entryId: created.sys.id }, created);
        createdLinks.push(entryLink(created.sys.id));
      }

      if (createdLinks.length) {
        await sdk.field.setValue([...currentLinks, ...createdLinks]);
      }

      const skipped = uniqueTeamIds.length - newTeamIds.length;
      const label = interestGroupName ?? 'the interest group';
      sdk.notifier.success(
        `Added ${newTeamIds.length} team(s) from ${label}.` +
          (skipped ? ` ${skipped} already in the list.` : ''),
      );
    } catch {
      sdk.notifier.error('Could not add the interest group. Please try again.');
    } finally {
      setIsAddingGroup(false);
    }
  };

  return (
    <Stack flexDirection="column" alignItems="stretch" spacing="spacingM">
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
          createNew: () => 'Add team',
        }}
      />
      <Box>
        <Button
          variant="secondary"
          isLoading={isAddingGroup}
          isDisabled={isAddingGroup}
          onClick={() => {
            void addInterestGroup();
          }}
        >
          Add interest group
        </Button>
      </Box>
    </Stack>
  );
};

export default Field;
