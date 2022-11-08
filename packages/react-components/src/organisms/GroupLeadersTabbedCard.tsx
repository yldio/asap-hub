import { GroupLeader } from '@asap-hub/model';
import { css } from '@emotion/react';
import React from 'react';
import { MembersList, TabbedCard } from '../molecules';
import { rem, tabletScreen } from '../pixels';
import { splitListBy } from '../utils';

const containerStyles = css({
  padding: `${rem(32)} 0`,
  display: 'grid',
  rowGap: rem(12),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    columnGap: rem(15),
  },
});

type GroupLeadersTabbedCardProps = {
  leaders: ReadonlyArray<Pick<GroupLeader, 'user' | 'role'>>;
  isGroupActive: boolean;
};

const GroupLeadersTabbedCard: React.FC<GroupLeadersTabbedCardProps> = ({
  leaders,
  isGroupActive,
}) => {
  const [inactiveLeaders, activeLeaders] = splitListBy(
    leaders,
    (leader) => !isGroupActive || !!leader?.user?.alumniSinceDate,
  );

  return (
    <TabbedCard
      title={'Interest Group Leaders'}
      activeTabIndex={isGroupActive ? 0 : 1}
      tabs={[
        {
          tabTitle: `Active Leaders (${activeLeaders.length})`,
          items: activeLeaders,
          disabled: !isGroupActive,
        },
        {
          tabTitle: `Past Leaders (${inactiveLeaders.length})`,
          items: inactiveLeaders,
          disabled: inactiveLeaders.length === 0,
        },
      ]}
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
};

export default GroupLeadersTabbedCard;
