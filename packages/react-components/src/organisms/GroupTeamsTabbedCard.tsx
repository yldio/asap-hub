import { TeamResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { Link } from '../atoms';
import { inactiveBadgeIcon, teamIcon } from '../icons';
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
  'title' | 'description'
> & {
  teams: ReadonlyArray<
    Pick<TeamResponse, 'id' | 'displayName' | 'inactiveSince'>
  >;
  isGroupInactive: boolean;
};

const GroupTeamsTabbedCard: React.FC<GroupTeamsTabbedCardProps> = ({
  title,
  description,
  teams,
  isGroupInactive,
}) => {
  const [activeTeams, inactiveTeams] = splitListBy<
    Pick<TeamResponse, 'id' | 'displayName' | 'inactiveSince'>
  >(['inactiveSince'], teams, isGroupInactive);

  return (
    <TabbedCard
      title={title}
      description={description}
      activeTabIndex={isGroupInactive ? 1 : 0}
      tabs={[
        {
          tabTitle: `Active Teams (${activeTeams.length})`,
          items: activeTeams,
          truncateFrom: 8,
          disabled: isGroupInactive,
        },
        {
          tabTitle: `Past Teams (${inactiveTeams.length})`,
          items: inactiveTeams,
          truncateFrom: 8,
          disabled: inactiveTeams.length === 0,
        },
      ]}
      getShowMoreText={(showMore) => `View ${showMore ? 'Less' : 'More'} Teams`}
    >
      {({ data }) => (
        <ul css={containerStyles}>
          {data.map(({ id, displayName, inactiveSince }) => (
            <li key={`team-${id}`} css={listItemStyle}>
              {teamIcon}
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
