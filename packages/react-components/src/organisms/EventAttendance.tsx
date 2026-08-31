import { TeamType } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import { Button, Card, Headline3, Link, Paragraph } from '../atoms';
import { neutral1000, steel } from '../colors';
import {
  ExportIcon,
  InactiveBadgeIcon,
  invalidTickIcon,
  PencilIcon,
  plusIcon,
  tickInCircleIcon,
} from '../icons';
import { EventAttendanceMetric } from '../molecules';
import { rem } from '../pixels';

import { defaultVisibleTeams, teamIcon } from './shared-event-card';
import {
  actionsStyles,
  cellStyles,
  contentStyles,
  contentWithFooterStyles,
  editIconButtonStyles,
  emptyStateStyles,
  headerCellStyles,
  headerStyles,
  horizontalScrollGutter,
  iconButtonStyles,
  metricsStyles,
  statusCellStyles,
  statusIconStyles,
  tableWrapperStyles,
  teamInfoNoWrapStyles,
  viewMoreStyles,
} from './shared-event-card-styles';

const tableStyles = css({
  width: '100%',
  borderCollapse: 'collapse',
  'tbody tr': {
    borderBottom: `1px solid ${steel.rgb}`,
  },
  'tbody tr:last-child': {
    borderBottom: 'none',
  },
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

export type EventAttendanceTeamType = TeamType;

export type EventAttendanceTeam = {
  teamId: string;
  teamName: string;
  attended: boolean;
  teamType?: EventAttendanceTeamType;
  isTeamInactive?: boolean;
  attendanceId?: string;
};

export type EventAttendanceSinceLastEvent = {
  // signed change in attending teams versus the previous event.
  count: number;
  teamsAttended: number;
  teamsTotal: number;
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

type EventAttendanceProps = {
  teamsAttended: number;
  teamsTotal: number;
  // absent for the first event in a recurring series (nothing to compare to).
  sinceLastEvent?: EventAttendanceSinceLastEvent;
  teams: EventAttendanceTeam[];
  onExport?: () => void;
  onEdit?: () => void;
  onAddAttendance?: () => void;
};

const EventAttendance: React.FC<EventAttendanceProps> = ({
  teamsAttended,
  teamsTotal,
  sinceLastEvent,
  teams,
  onExport,
  onEdit,
  onAddAttendance,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [tableRef, teamsOverflowing] = useHorizontalOverflow();
  const sortedTeams = [...teams].sort(compareAttendanceTeams);
  const hasMoreRows = sortedTeams.length > defaultVisibleTeams;
  const visibleTeams = expanded
    ? sortedTeams
    : sortedTeams.slice(0, defaultVisibleTeams);
  const attendancePercentage =
    teamsTotal > 0 ? Math.round((teamsAttended / teamsTotal) * 100) : 0;

  if (teams.length === 0) {
    return (
      <Card>
        <div css={emptyStateStyles}>
          <Headline3 noMargin>Attendance</Headline3>
          {onAddAttendance ? (
            <>
              <Paragraph noMargin accent="lead">
                Add the teams that took part, then mark who attended.
              </Paragraph>
              <Button primary small noMargin onClick={onAddAttendance}>
                {plusIcon} Add Attendance
              </Button>
            </>
          ) : (
            <Paragraph noMargin accent="lead">
              No attendance recorded yet
            </Paragraph>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card padding={false}>
      <div css={[contentStyles, hasMoreRows && contentWithFooterStyles]}>
        <div css={headerStyles}>
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

        <div css={metricsStyles}>
          <EventAttendanceMetric
            variant="progress"
            label="This event"
            value={attendancePercentage}
            caption={`${teamsAttended} of ${teamsTotal} teams`}
          />
          {!sinceLastEvent ? (
            <EventAttendanceMetric
              variant="empty"
              label="Since last event"
              message="No previous event to compare to."
            />
          ) : sinceLastEvent.count === 0 ? (
            <EventAttendanceMetric
              variant="delta"
              direction="none"
              label="Since last event"
              value={0}
              caption={`No change from ${sinceLastEvent.teamsAttended} of ${sinceLastEvent.teamsTotal} teams`}
            />
          ) : (
            <EventAttendanceMetric
              variant="delta"
              direction={sinceLastEvent.count < 0 ? 'down' : 'up'}
              label="Since last event"
              value={Math.abs(sinceLastEvent.count)}
              caption={`from ${sinceLastEvent.teamsAttended} of ${sinceLastEvent.teamsTotal} teams`}
            />
          )}
        </div>

        <div
          css={[tableWrapperStyles, teamsOverflowing && horizontalScrollGutter]}
          ref={tableRef}
        >
          <table
            css={[
              tableStyles,
              // last row: 32px before the footer divider, otherwise flush to
              // the card's bottom padding.
              {
                'tbody tr:last-child td': {
                  paddingBottom: hasMoreRows ? rem(32) : 0,
                },
              },
            ]}
          >
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
            <tbody>
              {visibleTeams.map((team) => (
                <tr key={team.teamId}>
                  <td css={teamCellStyles}>
                    <span css={[teamInnerStyles, teamInfoNoWrapStyles]}>
                      {teamIcon(team.teamType)}
                      <Link
                        href={
                          network({}).teams({}).team({ teamId: team.teamId }).$
                        }
                      >
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
                      {team.attended ? tickInCircleIcon : invalidTickIcon}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hasMoreRows && (
        <div css={viewMoreStyles}>
          <Button linkStyle onClick={() => setExpanded((current) => !current)}>
            {expanded ? 'View Less Attendees' : 'View More Attendees'}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EventAttendance;
