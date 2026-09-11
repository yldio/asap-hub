import { TeamType } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import { Button, Card, Headline3, Link, Paragraph } from '../atoms';
import { lead, neutral800, neutral1000, steel } from '../colors';
import {
  ExportIcon,
  InactiveBadgeIcon,
  InvalidTickIcon,
  PencilIcon,
  tickInCircleIcon,
} from '../icons';
import { EventAttendanceMetric } from '../molecules';
import { rem } from '../pixels';
import { pluralizeTeams } from '../utils/events';

import { teamIcon } from './shared-event-card';
import {
  actionsStyles,
  cellStyles,
  contentStyles,
  editIconButtonStyles,
  emptyStateStyles,
  headerCellStyles,
  headerStyles,
  horizontalScrollGutter,
  iconButtonStyles,
  statusCellStyles,
  statusIconStyles,
  tableWrapperStyles,
  teamInfoNoWrapStyles,
} from './shared-event-card-styles';

// Rows past this count are hidden behind the section's own "Show more".
const visibleTeamsPerSection = 5;

const tableStyles = css({
  width: '100%',
  borderCollapse: 'collapse',
});

const rowDividerStyles = css({
  borderBottom: `1px solid ${steel.rgb}`,
});

const teamCellStyles = css([
  cellStyles,
  {
    // keep a minimum 24px gap between the team name and the attendance column.
    paddingRight: rem(24),
  },
]);

const teamInnerStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
});

const attendanceColStyles = css({ width: '1%' });

const metricStyles = css({ marginTop: rem(24) });

const sectionHeaderCellStyles = css({
  textAlign: 'left',
  fontWeight: 400,
  padding: `${rem(16)} 0`,
});

const sectionTitleStyles = css({
  fontSize: rem(14),
  lineHeight: rem(16),
  color: neutral1000.rgb,
});

const sectionSeparatorStyles = css({
  fontSize: rem(14),
  lineHeight: rem(16),
  color: lead.rgb,
  padding: `0 ${rem(4)}`,
});

const sectionCountStyles = css({
  fontSize: rem(14),
  lineHeight: rem(16),
  color: lead.rgb,
});

const sectionHelperStyles = css({
  margin: `${rem(4)} 0 0`,
  fontSize: rem(14),
  lineHeight: rem(16),
  color: neutral800.rgb,
});

const showMoreCellStyles = css({
  padding: `${rem(16)} 0 0`,
});

export type EventAttendanceTeamType = TeamType;

export type EventAttendanceTeam = {
  teamId: string;
  teamName: string;
  attended: boolean;
  teamType?: EventAttendanceTeamType;
  isTeamInactive?: boolean;
  attendanceId?: string;
  // Derived on the client by intersecting the attendance rows with the teams of
  // the interest group hosting the event; never persisted.
  isFromInterestGroup?: boolean;
};

// Attended teams first, then active before inactive, then by name in natural
// order (numeric collation, so "Team 2" precedes "Team 10"), with teamId as a
// stable tiebreaker so equal names order deterministically.
export const compareAttendanceTeams = (
  a: EventAttendanceTeam,
  b: EventAttendanceTeam,
): number =>
  Number(b.attended) - Number(a.attended) ||
  Number(!!a.isTeamInactive) - Number(!!b.isTeamInactive) ||
  a.teamName.localeCompare(b.teamName, undefined, { numeric: true }) ||
  a.teamId.localeCompare(b.teamId);

const useHorizontalOverflow = () => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);
  useEffect(() => {
    if (!element) {
      return undefined;
    }
    const measure = () =>
      setOverflowing(element.scrollWidth > element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return [setElement, overflowing] as const;
};

const attendedCount = (teams: EventAttendanceTeam[]) =>
  teams.filter(({ attended }) => attended).length;

const TeamRows: React.FC<{ teams: EventAttendanceTeam[] }> = ({ teams }) => (
  <>
    {teams.map((team, index) => (
      <tr
        key={team.teamId}
        css={index < teams.length - 1 ? rowDividerStyles : undefined}
      >
        <td css={teamCellStyles}>
          <span css={[teamInnerStyles, teamInfoNoWrapStyles]}>
            {teamIcon(team.teamType)}
            <Link href={network({}).teams({}).team({ teamId: team.teamId }).$}>
              {team.teamName}
            </Link>
            {team.isTeamInactive && <InactiveBadgeIcon />}
          </span>
        </td>
        <td css={statusCellStyles}>
          <span
            css={statusIconStyles}
            role="img"
            aria-label={team.attended ? 'Attended' : 'Did not attend'}
          >
            {team.attended ? (
              tickInCircleIcon
            ) : (
              <InvalidTickIcon color={steel.rgb} />
            )}
          </span>
        </td>
      </tr>
    ))}
  </>
);

const AttendanceSection: React.FC<{
  title: string;
  teams: EventAttendanceTeam[];
  helperText?: string;
}> = ({ title, teams, helperText }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleTeams = expanded
    ? teams
    : teams.slice(0, visibleTeamsPerSection);
  const hiddenCount = teams.length - visibleTeams.length;

  return (
    <tbody>
      <tr>
        <th css={sectionHeaderCellStyles} colSpan={2} scope="colgroup">
          <span css={sectionTitleStyles}>{title}</span>
          <span css={sectionSeparatorStyles}>•</span>
          <span css={sectionCountStyles}>
            {attendedCount(teams)} of {teams.length} attended
          </span>
          {helperText && <p css={sectionHelperStyles}>{helperText}</p>}
        </th>
      </tr>
      <TeamRows teams={visibleTeams} />
      {(hiddenCount > 0 || expanded) && (
        <tr>
          <td css={showMoreCellStyles} colSpan={2}>
            <Button linkStyle onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Show less' : `Show ${hiddenCount} more`}
            </Button>
          </td>
        </tr>
      )}
    </tbody>
  );
};

type EventAttendanceProps = {
  teams: EventAttendanceTeam[];
  interestGroupName?: string;
  onExport?: () => void;
  onEdit?: () => void;
};

const EventAttendance: React.FC<EventAttendanceProps> = ({
  teams,
  interestGroupName,
  onExport,
  onEdit,
}) => {
  const [tableRef, teamsOverflowing] = useHorizontalOverflow();
  const interestGroupTeams = teams.filter(
    ({ isFromInterestGroup }) => isFromInterestGroup,
  );
  const additionalTeams = teams.filter(
    ({ isFromInterestGroup }) => !isFromInterestGroup,
  );
  const interestGroupAttended = attendedCount(interestGroupTeams);
  const attendancePercentage =
    interestGroupTeams.length > 0
      ? Math.round((interestGroupAttended / interestGroupTeams.length) * 100)
      : 0;

  // The editor is reachable from the empty card too, so a project manager can
  // still record attendance for an event with no interest-group teams.
  const header = (
    <div css={[headerStyles, { alignSelf: 'stretch' }]}>
      <Headline3 noMargin>Attendance</Headline3>
      {(onExport || onEdit) && (
        <div css={actionsStyles}>
          {onExport && (
            <Button
              small
              noMargin
              aria-label="Download attendance"
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
              aria-label="Edit attendance"
              onClick={onEdit}
              overrideStyles={editIconButtonStyles}
            >
              <PencilIcon color={neutral1000.rgb} />
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (teams.length === 0) {
    return (
      <Card>
        <div css={emptyStateStyles}>
          {header}
          <Paragraph noMargin accent="lead">
            No attendance recorded yet
          </Paragraph>
        </div>
      </Card>
    );
  }

  return (
    <Card padding={false}>
      <div css={contentStyles}>
        {header}

        {/* D19: with no interest-group rows there is nothing to measure. */}
        {interestGroupTeams.length > 0 && (
          <div css={metricStyles}>
            <EventAttendanceMetric
              label="This event"
              value={attendancePercentage}
              caption={`${interestGroupAttended} of ${pluralizeTeams(
                interestGroupTeams.length,
              )}`}
              captionDetail="from the interest group"
            />
          </div>
        )}

        <div
          css={[tableWrapperStyles, teamsOverflowing && horizontalScrollGutter]}
          ref={tableRef}
        >
          <table css={tableStyles}>
            <colgroup>
              <col />
              <col css={attendanceColStyles} />
            </colgroup>
            <thead>
              <tr>
                <th css={headerCellStyles} scope="col">
                  Teams
                </th>
                <th css={headerCellStyles} scope="col">
                  Attendance
                </th>
              </tr>
            </thead>
            {interestGroupTeams.length > 0 && (
              <AttendanceSection
                title={
                  interestGroupName
                    ? `From ${interestGroupName}`
                    : 'From interest group'
                }
                teams={interestGroupTeams}
              />
            )}
            {additionalTeams.length > 0 && (
              <AttendanceSection
                title="Additional teams"
                teams={additionalTeams}
                helperText="Teams from outside the interest group."
              />
            )}
          </table>
        </div>
      </div>
    </Card>
  );
};

export default EventAttendance;
