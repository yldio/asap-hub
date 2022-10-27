import { GroupResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { Paragraph } from '../atoms';
import { charcoal, steel } from '../colors';
import { teamIcon } from '../icons';
import { LinkHeadline, TabbedCard } from '../molecules';
import { perRem, rem, tabletScreen } from '../pixels';

const itemsListWrapper = css({
  listStyle: 'none',
  margin: 0,
  display: 'grid',
  rowGap: rem(12),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    columnGap: rem(15),
  },
});

const listStyles = css({
  padding: 0,
  margin: 0,
  listStyleType: 'none',
});

const listElementStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: `${24 / perRem}em`,
  paddingTop: `${28 / perRem}em`,
  paddingBottom: `${28 / perRem}em`,
  borderBottom: `1px solid ${steel.rgb}`,
  ':last-child': {
    borderBottom: 'none',
  },
});

const teamsStyles = css({
  color: charcoal.rgb,
  display: 'flex',
  alignItems: 'center',
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

const paragraphStyles = css({
  margin: 0,
  paddingTop: `${rem(32)}`,
  paddingBottom: `${rem(32)}`,
});

type TeamTabbedGroupsCardProps = Pick<
  ComponentProps<typeof TabbedCard>,
  'title'
> & {
  groups: GroupResponse[];
};

const TeamTabbedGroupsCard: React.FC<TeamTabbedGroupsCardProps> = ({
  title,
  groups,
}) => (
  <TabbedCard
    title={title}
    activeTabIndex={1}
    getShowMoreText={(showMore) => `View ${showMore ? 'Less' : 'More'} Groups`}
    tabs={[
      {
        tabTitle: 'Active Memberships (0)',
        items: [],
        disabled: true,
      },
      {
        tabTitle: `Past Memberships (${groups.length})`,
        items: groups,
        truncateFrom: 2,
      },
    ]}
  >
    {({ data }) => (
      <div css={itemsListWrapper}>
        {data.length > 0 ? (
          <ul css={listStyles}>
            {data.map(({ id, teams, description, name }, index) => (
              <li css={listElementStyles} key={`team-group-${index}`}>
                <LinkHeadline
                  href={network({}).groups({}).group({ groupId: id }).$}
                  level={4}
                  noMargin={true}
                >
                  {name}
                </LinkHeadline>
                <Paragraph hasMargin={false} accent="lead">
                  {description}
                </Paragraph>
                <span css={teamsStyles}>
                  <span css={iconStyles}>{teamIcon} </span>
                  {teams.length} Team{teams.length !== 1 ? 's' : ''}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p css={paragraphStyles}>There are no active memberships.</p>
        )}
      </div>
    )}
  </TabbedCard>
);

export default TeamTabbedGroupsCard;
