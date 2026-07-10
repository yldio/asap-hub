import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';

import { Button, Card, Headline3, Link } from '../atoms';
import { charcoal, paper, steel, tin } from '../colors';
import {
  DiscoveryTeamIcon,
  ExportIcon,
  InactiveBadgeIcon,
  invalidTickIcon,
  PencilIcon,
  ResourceTeamIcon,
  TeamIcon,
  validTickIcon,
} from '../icons';
import { EventAttendanceMetric } from '../molecules';
import { rem, tabletScreen } from '../pixels';

const defaultVisibleTeams = 10;

const contentStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

const contentWithFooterStyles = css({
  paddingBottom: 0,
});

const headerStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(15),
});

const actionsStyles = css({
  display: 'flex',
  gap: rem(12),
});

const iconButtonStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: rem(9),
  backgroundColor: paper.rgb,
  border: `1px solid ${tin.rgb}`,
  borderRadius: rem(4),
  cursor: 'pointer',
});

const metricsStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: rem(24),
  marginTop: rem(24),

  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '1fr 1fr',
  },
});

const tableWrapperStyles = css({
  marginTop: rem(40),
  overflowX: 'auto',
});

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

const headerCellStyles = css({
  textAlign: 'left',
  color: charcoal.rgb,
  fontSize: rem(17),
  fontWeight: 'bold',
  lineHeight: rem(24),
  letterSpacing: rem(0.1),
});

const attendanceHeaderCellStyles = css([
  headerCellStyles,
  {
    // on mobile the Attendance header centers to match the centered icons.
    [`@media (max-width: ${tabletScreen.min}px)`]: {
      textAlign: 'center',
    },
  },
]);

const cellStyles = css({
  // 16px top + 16px bottom → 32px (16 + 16) between rows around the separator,
  // and a 16px gap between the header and the first row.
  padding: `${rem(16)} 0`,
  verticalAlign: 'middle',
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

const statusCellStyles = css([
  cellStyles,
  {
    // icon-only cell: collapse the line box so the icon centers via the cell's
    // middle vertical-align instead of sitting on the text baseline.
    lineHeight: 0,
    // on mobile the icon is centered horizontally within its column.
    [`@media (max-width: ${tabletScreen.min}px)`]: {
      textAlign: 'center',
    },
    '& svg': {
      display: 'block',
      width: rem(24),
      height: rem(24),
    },
  },
]);

const statusIconStyles = css({
  display: 'inline-flex',
  verticalAlign: 'middle',
});

const viewMoreStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: rem(56),
  borderTop: `1px solid ${steel.rgb}`,
});

export type EventAttendanceTeamType = 'discovery' | 'resource';

export type EventAttendanceTeam = {
  teamId: string;
  teamName: string;
  attended: boolean;
  teamType?: EventAttendanceTeamType;
  isTeamInactive?: boolean;
};

const teamIcon = (teamType?: EventAttendanceTeamType) => {
  switch (teamType) {
    case 'discovery':
      return <DiscoveryTeamIcon />;
    case 'resource':
      return <ResourceTeamIcon />;
    default:
      return <TeamIcon />;
  }
};

export type EventAttendanceSinceLastEvent = {
  percentage: number;
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
};

const EventAttendance: React.FC<EventAttendanceProps> = ({
  teamsAttended,
  teamsTotal,
  sinceLastEvent,
  teams,
  onExport,
  onEdit,
}) => {
  const [expanded, setExpanded] = useState(false);
  const showFooter = !expanded && teams.length > defaultVisibleTeams;
  const visibleTeams = expanded ? teams : teams.slice(0, defaultVisibleTeams);
  const attendancePercentage =
    teamsTotal > 0 ? Math.round((teamsAttended / teamsTotal) * 100) : 0;

  return (
    <Card padding={false}>
      <div css={[contentStyles, showFooter && contentWithFooterStyles]}>
        <div css={headerStyles}>
          <Headline3 noMargin>Attendance</Headline3>
          <div css={actionsStyles}>
            <button
              type="button"
              css={iconButtonStyles}
              onClick={onExport}
              aria-label="Download attendance"
            >
              {ExportIcon}
            </button>
            <button
              type="button"
              css={iconButtonStyles}
              onClick={onEdit}
              aria-label="Edit attendance"
            >
              <PencilIcon />
            </button>
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
              direction={sinceLastEvent.percentage < 0 ? 'down' : 'up'}
              label="Since last event"
              value={Math.abs(sinceLastEvent.percentage)}
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
                <th css={attendanceHeaderCellStyles} scope="col">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleTeams.map((team) => (
                <tr key={team.teamId}>
                  <td css={teamCellStyles}>
                    <span css={teamInnerStyles}>
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
                      {team.attended ? validTickIcon : invalidTickIcon}
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
