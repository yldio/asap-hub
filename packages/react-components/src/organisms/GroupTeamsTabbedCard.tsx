import { TeamResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { Link, Paragraph } from '../atoms';
import { inactiveBadgeIcon, TeamIcon } from '../icons';
import { TabbedCard } from '../molecules';
import { perRem, rem, tabletScreen } from '../pixels';
import { splitListBy } from '../utils';

const inactiveBadgeStyles = css({
  lineHeight: `${18 / perRem}em`,
  verticalAlign: 'middle',
});

const listItemStyle = css({
  display: 'flex',
  flexFlow: 'row',
  gap: `${9 / perRem}em`,
});

const containerStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: `${rem(32)} 0`,
  display: 'grid',
  rowGap: rem(12),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '1fr 1fr',
    columnGap: rem(15),
  },
});

type GroupTeamsTabbedCardProps = Pick<
  ComponentProps<typeof TabbedCard>,
  'description'
> & {
  teams: ReadonlyArray<
    Pick<TeamResponse, 'id' | 'displayName' | 'inactiveSince'>
  >;
  isGroupActive: boolean;
};

const GroupTeamsTabbedCard: React.FC<GroupTeamsTabbedCardProps> = ({
  teams,
  isGroupActive,
}) => {
  const [inactiveTeams, activeTeams] = splitListBy(
    teams,
    (team) => !isGroupActive || !!team?.inactiveSince,
  );

  return (
    <TabbedCard
      title={'Interest Group Teams'}
      activeTabIndex={isGroupActive ? 0 : 1}
      tabs={[
        {
          tabTitle: `Active Teams (${activeTeams.length})`,
          items: activeTeams,
          truncateFrom: 8,
          disabled: !isGroupActive,
          empty: (
            <Paragraph accent="lead">
              There are no active team members.
            </Paragraph>
          ),
        },
        {
          tabTitle: `Past Teams (${inactiveTeams.length})`,
          items: inactiveTeams,
          truncateFrom: 8,
          disabled: inactiveTeams.length === 0,
          empty: (
            <Paragraph accent="lead">There are no past team members.</Paragraph>
          ),
        },
      ]}
      getShowMoreText={(showMore) => `View ${showMore ? 'Less' : 'More'} Teams`}
    >
      {({ data }) => (
        <ul css={containerStyles}>
          {data.map(({ id, displayName, inactiveSince }) => (
            <li key={`team-${id}`} css={listItemStyle}>
              <TeamIcon />
              <Link
                ellipsed
                href={network({}).teams({}).team({ teamId: id }).$}
              >
                {displayName}
              </Link>
              {inactiveSince && (
                <span css={inactiveBadgeStyles}>{inactiveBadgeIcon}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </TabbedCard>
  );
};

export default GroupTeamsTabbedCard;
