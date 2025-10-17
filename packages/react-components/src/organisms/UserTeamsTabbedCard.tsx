import { TeamRole, UserTeam } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { Fragment } from 'react';
import { Divider, Link, Paragraph } from '../atoms';
import { InactiveBadgeIcon } from '../icons';
import { TabbedCard } from '../molecules';
import { rem, tabletScreen } from '../pixels';
import { splitListBy } from '../utils';
import { formatDateToTimezone } from '../date';

const MAX_TEAMS = 5;

const inactiveBadgeStyles = css({
  lineHeight: 0,
  verticalAlign: 'top',
  marginLeft: rem(8),
});

const listItemStyle = css({
  display: 'grid',

  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr 1fr',
  rowGap: rem(12),

  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridAutoFlow: 'column',
    gridTemplateColumns: '1fr 1fr',

    '&:not(:first-of-type)': {
      gridTemplateRows: '1fr',
    },

    [`&:not(:first-of-type) > :nth-of-type(odd)`]: {
      display: 'none',
    },
  },
});

const containerStyle = css({
  display: 'grid',

  columnGap: rem(12),

  margin: 0,
  marginTop: rem(24),

  padding: 0,
  listStyle: 'none',
});

const titleStyle = css({
  fontWeight: 'bold',
});

const detailsContentStyle = css({
  marginBottom: rem(32),
});

const priorities: Record<TeamRole, number> = {
  'Lead PI (Core Leadership)': 1,
  'Co-PI (Core Leadership)': 2,
  'Collaborating PI': 3,
  'Project Manager': 4,
  'Data Manager': 5,
  'Key Personnel': 6,
  'ASAP Staff': 7,
  'Scientific Advisory Board': 8,
  Trainee: 9,
};

type UserTeamsTabbedCardProps = {
  userAlumni: boolean;
  teams: UserTeam[];
};

const UserTeamsTabbedCard: React.FC<UserTeamsTabbedCardProps> = ({
  userAlumni,
  teams,
}) => {
  const sortedTeams = [...teams].sort(
    (a, b) => priorities[a.role] - priorities[b.role],
  );
  const teamHref = (id: string) => network({}).teams({}).team({ teamId: id }).$;
  const [inactiveTeams, activeTeams] = splitListBy(
    sortedTeams,
    (team) =>
      userAlumni || !!team?.teamInactiveSince || !!team?.inactiveSinceDate,
  );
  return (
    <div id="user-teams-tabbed-card">
      <TabbedCard
        title="Teams and Roles"
        description={
          <Paragraph noMargin accent="lead" styles={css({ margin: '0 0 8px' })}>
            Teams are a constellation of labs focus on a specific grant
            proposal. Find out teams status and the member's current and past
            roles within them.
          </Paragraph>
        }
        activeTabIndex={userAlumni ? 1 : 0}
        tabs={[
          {
            tabTitle: `Current (${activeTeams.length})`,
            items: activeTeams,
            truncateFrom: MAX_TEAMS,
            empty: (
              <Paragraph accent="lead">There are no current teams.</Paragraph>
            ),
          },
          {
            tabTitle: `Former (${inactiveTeams.length})`,
            items: inactiveTeams,
            truncateFrom: MAX_TEAMS,
            empty: (
              <Paragraph accent="lead">There are no previous teams.</Paragraph>
            ),
          },
        ]}
        getShowMoreText={(showMore) =>
          `View ${showMore ? 'Less' : 'More'} Teams`
        }
      >
        {({ data }) => (
          <div css={detailsContentStyle}>
            <ul css={containerStyle}>
              {data.map(
                (
                  {
                    id,
                    displayName,
                    teamInactiveSince,
                    role: teamRole,
                    inactiveSinceDate,
                  },
                  idx,
                ) => {
                  const showDateLeftColumn =
                    !!inactiveSinceDate || !!teamInactiveSince;
                  const formattedDateLeft =
                    showDateLeftColumn &&
                    formatDateToTimezone(
                      (inactiveSinceDate || teamInactiveSince) as string,
                      'eee, dd MMM yyyy',
                    );
                  return (
                    <Fragment key={`team-${idx}`}>
                      {idx === 0 || <Divider />}
                      <li key={idx} css={listItemStyle}>
                        <div css={[titleStyle]}>Team</div>
                        <div>
                          <Link href={teamHref(id)}>Team {displayName}</Link>
                          {teamInactiveSince && (
                            <span css={inactiveBadgeStyles}>
                              <InactiveBadgeIcon />
                            </span>
                          )}
                        </div>
                        <div css={[titleStyle]}>Role</div>
                        <div>{teamRole}</div>
                        {showDateLeftColumn && (
                          <>
                            <div css={[titleStyle]}>Date Left</div>
                            <div>{formattedDateLeft}</div>
                          </>
                        )}
                      </li>
                    </Fragment>
                  );
                },
              )}
            </ul>
          </div>
        )}
      </TabbedCard>
    </div>
  );
};

export default UserTeamsTabbedCard;
