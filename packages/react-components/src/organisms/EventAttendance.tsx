import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';

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

const tableStyles = css({
  width: '100%',
  borderCollapse: 'collapse',
  'tbody tr': {
    borderBottom: `1px solid ${steel.rgb}`,
  },
  'tbody tr:last-child': {
    borderBottom: 'none',
  },
  // on mobile the Attendance column (header + icons) centers.
  [`@media (max-width: ${tabletScreen.min}px)`]: {
    'th:last-child, td:last-child': {
      textAlign: 'center',
    },
  },
});

const teamCellStyles = css([
  cellStyles,
  {
    // keep a minimum 24px gap between the team name and the attendance column.
    paddingRight: rem(24),
  },
]);

export type EventAttendanceTeamType = EventTeamType;

export type EventAttendanceTeam = {
  teamId: string;
  teamName: string;
  attended: boolean;
  teamType?: EventAttendanceTeamType;
  isTeamInactive?: boolean;
};

export type EventAttendanceSinceLastEvent = {
  // signed change in attending teams versus the previous event.
  count: number;
  teamsAttended: number;
  teamsTotal: number;
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
  const showFooter = !expanded && teams.length > defaultVisibleTeams;
  const visibleTeams = expanded ? teams : teams.slice(0, defaultVisibleTeams);
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
      <div css={[contentStyles, showFooter && contentWithFooterStyles]}>
        <div css={headerStyles}>
          <Headline3 noMargin>Attendance</Headline3>
          <div css={actionsStyles}>
            <Button
              small
              noMargin
              aria-label="Download attendance"
              onClick={onExport}
              overrideStyles={iconButtonStyles}
            >
              {ExportIcon}
            </Button>
            <Button
              small
              noMargin
              aria-label="Edit attendance"
              onClick={onEdit}
              overrideStyles={editIconButtonStyles}
            >
              <PencilIcon color={neutral1000.rgb} />
            </Button>
          </div>
        </div>

        <div css={metricsStyles}>
          <EventAttendanceMetric
            variant="progress"
            label="Attendance"
            value={attendancePercentage}
            caption={`${teamsAttended} of ${teamsTotal} teams`}
          />
          {sinceLastEvent && (
            <EventAttendanceMetric
              variant="delta"
              direction={sinceLastEvent.count < 0 ? 'down' : 'up'}
              label="Since last event"
              value={Math.abs(sinceLastEvent.count)}
              caption={`from ${sinceLastEvent.teamsAttended} of ${sinceLastEvent.teamsTotal} teams`}
            />
          )}
        </div>

        <div css={tableWrapperStyles}>
          <table
            css={[
              tableStyles,
              // last row: 32px before the footer divider, otherwise flush to
              // the card's bottom padding.
              {
                'tbody tr:last-child td': {
                  paddingBottom: showFooter ? rem(32) : 0,
                },
              },
            ]}
          >
            <colgroup>
              <col />
              <col css={{ width: rem(204) }} />
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
                    <span css={teamInfoStyles}>
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

      {showFooter && (
        <div css={viewMoreStyles}>
          <Button linkStyle onClick={() => setExpanded(true)}>
            View More Attendees
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EventAttendance;
