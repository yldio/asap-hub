import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';

import {
  Avatar,
  Button,
  Card,
  GradientProgressBar,
  GradientProgressWheel,
  Headline3,
  Link,
  Paragraph,
  Pill,
} from '../atoms';
import { lead, neutral1000, steel } from '../colors';
import {
  alumniBadgeIcon,
  chevronDownIcon,
  chevronUpIcon,
  ExportIcon,
  InactiveBadgeIcon,
  invalidTickIcon,
  PencilIcon,
  plusIcon,
  tickInCircleIcon,
} from '../icons';
import {
  metricBarStyles,
  metricContainerStyles,
  metricLabelStyles,
  metricProgressRowStyles,
  metricValueStyles,
  metricWheelStyles,
} from '../molecules/shared-metric-card-styles';
import { rem, tabletScreen } from '../pixels';

import {
  defaultVisibleTeams,
  EventTeamType,
  teamIcon,
} from './shared-event-card';
import {
  actionsStyles,
  cellStyles,
  contentStyles,
  contentWithFooterStyles,
  editIconButtonStyles,
  emptyStateStyles,
  headerCellStyles,
  headerStyles,
  iconButtonStyles,
  metricsStyles,
  statusCellStyles,
  statusIconStyles,
  tableWrapperStyles,
  teamInfoStyles,
  viewMoreStyles,
} from './shared-event-card-styles';

const mobileQuery = `@media (max-width: ${tabletScreen.min}px)`;

const speakerTableStyles = css({
  width: '100%',
  borderCollapse: 'collapse',
});

const findingsCenterMobileStyles = css({
  [mobileQuery]: {
    'th:nth-of-type(2), tbody td:nth-of-type(2)': {
      textAlign: 'center',
    },
  },
});

const findingsColStyles = css({ width: '33%' });
const chevronColStyles = css({ width: rem(40) });

const fullFindingsLabel = css({
  [mobileQuery]: { display: 'none' },
});

const shortFindingsLabel = css({
  display: 'none',
  [mobileQuery]: { display: 'inline' },
});

const teamGroupStyles = css({
  borderBottom: `1px solid ${steel.rgb}`,
  '&:last-of-type': {
    borderBottom: 'none',
  },
});

const chevronCellStyles = css({
  textAlign: 'right',
});

const membersCellStyles = css({
  padding: 0,
});

const leadTextStyles = css({
  color: lead.rgb,
});

const chevronButtonStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
});

const membersListStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: `0 0 ${rem(12 + 16)} ${rem(32)}`,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
  [mobileQuery]: {
    gap: rem(24),
    paddingLeft: rem(12),
  },
});

const memberRowStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  [mobileQuery]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const memberMainStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
});

const memberAvatarStyles = css({
  width: rem(24),
  height: rem(24),
  flexShrink: 0,
});

const alumniStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
});

const MetricCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div css={metricContainerStyles}>{children}</div>
);

const SpeakerCountMetric: React.FC<{
  label: string;
  value: number;
  caption: string;
}> = ({ label, value, caption }) => (
  <MetricCard>
    <p css={metricLabelStyles}>{label}</p>
    <p css={metricValueStyles}>{value}</p>
    <p css={metricLabelStyles}>{caption}</p>
  </MetricCard>
);

const FindingsMetric: React.FC<{
  label: string;
  value: number;
  caption: string;
}> = ({ label, value, caption }) => (
  <MetricCard>
    <div css={metricProgressRowStyles}>
      <span css={metricWheelStyles}>
        <GradientProgressWheel percentage={value} />
      </span>
      <div>
        <p css={metricLabelStyles}>{label}</p>
        <p css={metricValueStyles}>{value}%</p>
        <p css={metricLabelStyles}>{caption}</p>
      </div>
    </div>
    <div css={metricBarStyles}>
      <GradientProgressBar percentage={value} />
    </div>
  </MetricCard>
);

export type EventSpeakerMember = {
  id: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: string;
  isAlumni?: boolean;
};

export type EventSpeakerTeamType = EventTeamType;

export type EventSpeakerTeamRow = {
  teamId: string;
  teamName: string;
  teamType?: EventSpeakerTeamType;
  isTeamInactive?: boolean;
  sharedPreliminaryFindings: boolean;
  members: EventSpeakerMember[];
};

export type EventSpeakerExternalMember = {
  name: string;
};

export type EventSpeakerExternalRow = {
  sharedPreliminaryFindings: boolean;
  members: EventSpeakerExternalMember[];
};

type EventSpeakersProps = {
  teams: EventSpeakerTeamRow[];
  externalUsers?: EventSpeakerExternalRow;
  hasFinished?: boolean;
  onExport?: () => void;
  onEdit?: () => void;
  onAddSpeaker?: () => void;
};

const findingsIcon = (shared: boolean) => (
  <span
    css={statusIconStyles}
    role="img"
    aria-label={
      shared ? 'Shared preliminary findings' : 'No preliminary findings'
    }
  >
    {shared ? tickInCircleIcon : invalidTickIcon}
  </span>
);

const SpeakerRow: React.FC<{
  info: React.ReactNode;
  sharedPreliminaryFindings: boolean;
  showFindings: boolean;
  expanded: boolean;
  onToggle: () => void;
  label: string;
  collapsedBottomPadding?: string | number;
  children?: React.ReactNode;
}> = ({
  info,
  sharedPreliminaryFindings,
  showFindings,
  expanded,
  onToggle,
  label,
  collapsedBottomPadding,
  children,
}) => {
  const collapsedBottom =
    !expanded && collapsedBottomPadding !== undefined
      ? { paddingBottom: collapsedBottomPadding }
      : undefined;
  return (
    <tbody css={teamGroupStyles}>
      <tr>
        <td css={[cellStyles, collapsedBottom]}>
          <span css={teamInfoStyles}>{info}</span>
        </td>
        {showFindings && (
          <td css={[statusCellStyles, collapsedBottom]}>
            {findingsIcon(sharedPreliminaryFindings)}
          </td>
        )}
        <td css={[statusCellStyles, chevronCellStyles, collapsedBottom]}>
          <button
            type="button"
            css={chevronButtonStyles}
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={expanded ? `Collapse ${label}` : `Expand ${label}`}
          >
            {expanded ? chevronUpIcon : chevronDownIcon}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={showFindings ? 3 : 2} css={membersCellStyles}>
            {children}
          </td>
        </tr>
      )}
    </tbody>
  );
};

const editorEmptyMessage = (hasFinished: boolean): string =>
  hasFinished
    ? 'Add the people who presented at this event, then mark who shared preliminary findings.'
    : 'Add the speakers for this event. Marking who shared preliminary findings becomes available after the event.';

const EventSpeakers: React.FC<EventSpeakersProps> = ({
  teams,
  externalUsers,
  hasFinished = false,
  onExport,
  onEdit,
  onAddSpeaker,
}) => {
  const [expandedRows, setExpandedRows] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [showAll, setShowAll] = useState(false);

  // Preliminary findings are only shared once the event has taken place.
  const showFindings = hasFinished;

  const externalCount = externalUsers?.members.length ?? 0;
  const hasExternal = externalCount > 0;

  const teamsWithSpeakers = teams.filter((team) => team.members.length > 0);

  if (teamsWithSpeakers.length === 0 && !hasExternal) {
    return (
      <Card>
        <div css={emptyStateStyles}>
          <Headline3 noMargin>Speakers</Headline3>
          {onAddSpeaker ? (
            <>
              <Paragraph noMargin accent="lead">
                {editorEmptyMessage(hasFinished)}
              </Paragraph>
              <Button primary small noMargin onClick={onAddSpeaker}>
                {plusIcon} Add Speakers
              </Button>
            </>
          ) : (
            <Paragraph noMargin accent="lead">
              No speakers have been added for this event yet.
            </Paragraph>
          )}
        </div>
      </Card>
    );
  }

  const toggleRow = (key: string) =>
    setExpandedRows((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });

  const teamMemberCount = teamsWithSpeakers.reduce(
    (total, team) => total + team.members.length,
    0,
  );
  const teamsShared = teamsWithSpeakers.filter(
    (team) => team.sharedPreliminaryFindings,
  ).length;
  const totalSpeakers = teamMemberCount + externalCount;
  const teamsTotal = teamsWithSpeakers.length;
  const findingsPercentage =
    teamsTotal > 0 ? Math.round((teamsShared / teamsTotal) * 100) : 0;

  const totalRows = teamsTotal + (hasExternal ? 1 : 0);
  const showFooter = !showAll && totalRows > defaultVisibleTeams;
  const visibleTeams = showAll
    ? teamsWithSpeakers
    : teamsWithSpeakers.slice(0, defaultVisibleTeams - (hasExternal ? 1 : 0));
  const showExternalRow = hasExternal && (showAll || !showFooter);

  const lastRowPadding = (isLastTeam: boolean): string | number | undefined => {
    if (showFooter && isLastTeam) return rem(32);
    if (isLastTeam && !showExternalRow) return 0;
    return undefined;
  };

  return (
    <Card padding={false}>
      <div css={[contentStyles, showFooter && contentWithFooterStyles]}>
        <div css={headerStyles}>
          <Headline3 noMargin>Speakers</Headline3>
          <div css={actionsStyles}>
            {onExport && (
              <Button
                small
                noMargin
                aria-label="Download speakers"
                onClick={onExport}
                overrideStyles={iconButtonStyles}
              >
                {ExportIcon}
              </Button>
            )}
            {onEdit && (
              <Button
                small
                noMargin
                aria-label="Edit speakers"
                onClick={onEdit}
                overrideStyles={editIconButtonStyles}
              >
                <PencilIcon color={neutral1000.rgb} />
              </Button>
            )}
          </div>
        </div>

        <div css={metricsStyles}>
          <SpeakerCountMetric
            label="Speakers"
            value={totalSpeakers}
            caption={`${teamMemberCount} from teams • ${externalCount} non-CRN`}
          />
          {showFindings && (
            <FindingsMetric
              label="Preliminary findings"
              value={findingsPercentage}
              caption={`${teamsShared} of ${teamsTotal} teams`}
            />
          )}
        </div>

        <div css={tableWrapperStyles}>
          <table
            css={[
              speakerTableStyles,
              showFindings && findingsCenterMobileStyles,
            ]}
          >
            <colgroup>
              <col />
              {showFindings && <col css={findingsColStyles} />}
              <col css={chevronColStyles} />
            </colgroup>
            {showFindings && (
              <thead>
                <tr>
                  <th css={headerCellStyles} scope="col">
                    Speakers
                  </th>
                  <th css={headerCellStyles} scope="col">
                    <span css={fullFindingsLabel}>Preliminary Findings</span>
                    <span css={shortFindingsLabel}>P. Findings</span>
                  </th>
                  <th css={headerCellStyles} />
                </tr>
              </thead>
            )}

            {visibleTeams.map((team, index) => {
              const bottomOverride = lastRowPadding(
                index === visibleTeams.length - 1,
              );
              return (
                <SpeakerRow
                  key={team.teamId}
                  label={team.teamName}
                  sharedPreliminaryFindings={team.sharedPreliminaryFindings}
                  showFindings={showFindings}
                  expanded={expandedRows.has(team.teamId)}
                  onToggle={() => toggleRow(team.teamId)}
                  collapsedBottomPadding={bottomOverride}
                  info={
                    <>
                      {teamIcon(team.teamType)}
                      <Link
                        href={
                          network({}).teams({}).team({ teamId: team.teamId }).$
                        }
                      >
                        {team.teamName}
                      </Link>
                      {team.isTeamInactive && <InactiveBadgeIcon />}
                      <span css={leadTextStyles}>({team.members.length})</span>
                    </>
                  }
                >
                  <ul
                    css={[
                      membersListStyles,
                      bottomOverride !== undefined && {
                        paddingBottom: bottomOverride,
                      },
                    ]}
                  >
                    {team.members.map((member) => (
                      <li key={member.id} css={memberRowStyles}>
                        <span css={memberMainStyles}>
                          <span css={memberAvatarStyles}>
                            <Avatar
                              firstName={member.firstName}
                              lastName={member.lastName}
                              imageUrl={member.avatarUrl}
                            />
                          </span>
                          <Link
                            href={
                              network({}).users({}).user({ userId: member.id })
                                .$
                            }
                          >
                            {member.displayName}
                          </Link>
                          {member.isAlumni && (
                            <span css={alumniStyles}>{alumniBadgeIcon}</span>
                          )}
                        </span>
                        <Pill accent="gray" noMargin>
                          {member.role}
                        </Pill>
                      </li>
                    ))}
                  </ul>
                </SpeakerRow>
              );
            })}

            {showExternalRow && externalUsers && (
              <SpeakerRow
                label="External Users"
                sharedPreliminaryFindings={
                  externalUsers.sharedPreliminaryFindings
                }
                showFindings={showFindings}
                expanded={expandedRows.has('external')}
                onToggle={() => toggleRow('external')}
                collapsedBottomPadding={0}
                info={
                  <>
                    <span css={leadTextStyles}>External Users</span>
                    <span css={leadTextStyles}>({externalCount})</span>
                  </>
                }
              >
                <ul css={[membersListStyles, { paddingBottom: 0 }]}>
                  {externalUsers.members.map((member, index) => (
                    <li key={`external-${index}`} css={memberRowStyles}>
                      <span css={leadTextStyles}>{member.name}</span>
                      <Pill accent="gray" noMargin>
                        Guest
                      </Pill>
                    </li>
                  ))}
                </ul>
              </SpeakerRow>
            )}
          </table>
        </div>
      </div>

      {showFooter && (
        <div css={viewMoreStyles}>
          <Button linkStyle onClick={() => setShowAll(true)}>
            View More Speakers
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EventSpeakers;
