import { TeamResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { Link } from '../atoms';
import { teamIcon } from '../icons';
import { TabbedCard } from '../molecules';
import { perRem, rem, tabletScreen } from '../pixels';
import { buildTabsConfig } from '../utils';

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
  teams: ReadonlyArray<
    Pick<TeamResponse, 'id' | 'displayName' | 'inactiveSince'>
  >;
  disableActiveTab?: boolean;
};

const TeamsTabbedCard: React.FC<TeamsTabbedCardProps> = ({
  title,
  description,
  teams,
  disableActiveTab = false,
}) => (
  <TabbedCard
    title={title}
    description={description}
    activeTabIndex={disableActiveTab ? 1 : 0}
    tabs={buildTabsConfig<
      Pick<TeamResponse, 'id' | 'displayName' | 'inactiveSince'>
    >({
      disableActiveTab,
      items: teams,
      label: 'Teams',
      lookupProps: ['inactiveSince'],
      truncateFrom: 8,
    })}
    getShowMoreText={(showMore) => `View ${showMore ? 'Less' : 'More'} Teams`}
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
