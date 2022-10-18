import { TeamResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { Link } from '../atoms';
import { teamIcon } from '../icons';
import { TabbedCard } from '../molecules';
import { perRem, rem, tabletScreen } from '../pixels';

const listItemStyle = css({
  display: 'grid',
  gridTemplateColumns: 'min-content 1fr',
  gridColumnGap: `${9 / perRem}em`,
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

type TeamsTabbedCardProps = Pick<
  ComponentProps<typeof TabbedCard>,
  'title' | 'description'
> & {
  teams: ReadonlyArray<Pick<TeamResponse, 'id' | 'displayName'>>;
};

const TeamsTabbedCard: React.FC<TeamsTabbedCardProps> = ({
  title,
  description,
  teams,
}) => (
  <TabbedCard
    title={title}
    description={description}
    activeTabIndex={1}
    tabs={[
      {
        tabTitle: 'Active Teams (0)',
        items: [],
        truncateFrom: 8,
        disabled: true,
      },
      {
        tabTitle: `Past Teams (${teams.length})`,
        items: teams,
        truncateFrom: 8,
        disabled: false,
      },
    ]}
    showMoreText={(showMore) => `View ${showMore ? 'Less' : 'More'} Teams`}
  >
    {({ data }) => (
      <ul css={containerStyles}>
        {data.map(({ id, displayName }) => (
          <li key={`team-${id}`} css={listItemStyle}>
            {teamIcon}
            <Link ellipsed href={network({}).teams({}).team({ teamId: id }).$}>
              {displayName}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </TabbedCard>
);

export default TeamsTabbedCard;
