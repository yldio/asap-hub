import { GroupLeader } from '@asap-hub/model';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { MembersList, TabbedCard } from '../molecules';
import { rem, tabletScreen } from '../pixels';

const containerStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: `${rem(32)} 0`,
  display: 'grid',
  rowGap: rem(12),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    columnGap: rem(15),
  },
});

type LeadersTabbedCardProps = Pick<
  ComponentProps<typeof TabbedCard>,
  'title' | 'description'
> & {
  leaders: ReadonlyArray<Pick<GroupLeader, 'user' | 'role'>>;
};

const LeadersTabbedCard: React.FC<LeadersTabbedCardProps> = ({
  title,
  description,
  leaders,
}) => (
  <TabbedCard
    title={title}
    description={description}
    activeTabIndex={1}
    tabs={[
      {
        tabTitle: 'Active Leaders (0)',
        items: [],
        truncateFrom: 4,
        disabled: true,
      },
      {
        tabTitle: `Past Leaders (${leaders.length})`,
        items: leaders,
        truncateFrom: 8,
      },
    ]}
    getShowMoreText={(showMore) => `View ${showMore ? 'Less' : 'More'} Leaders`}
  >
    {({ data }) => (
      <div css={containerStyles}>
        <MembersList
          members={data.map(({ user, role }) => ({
            ...user,
            firstLine: user.displayName,
            secondLine: role,
            thirdLine: user.teams.length <= 1 ? user.teams : 'Multiple Teams',
          }))}
        />
      </div>
    )}
  </TabbedCard>
);

export default LeadersTabbedCard;
