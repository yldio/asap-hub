import { GroupLeader } from '@asap-hub/model';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { MembersList, TabbedCard } from '../molecules';
import { rem, tabletScreen } from '../pixels';
import { splitListBy } from '../utils';

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

type GroupLeadersTabbedCardProps = Pick<
  ComponentProps<typeof TabbedCard>,
  'title' | 'description'
> & {
  leaders: ReadonlyArray<Pick<GroupLeader, 'user' | 'role'>>;
  isGroupInactive: boolean;
};

const GroupLeadersTabbedCard: React.FC<GroupLeadersTabbedCardProps> = ({
  title,
  description,
  leaders,
  isGroupInactive,
}) => {
  const [activeLeaders, inactiveLeaders] = splitListBy<
    Pick<GroupLeader, 'user' | 'role'>
  >(['user', 'alumniSinceDate'], leaders, isGroupInactive);

  return (
    <TabbedCard
      title={title}
      description={description}
      activeTabIndex={isGroupInactive ? 1 : 0}
      tabs={[
        {
          tabTitle: `Active Leaders (${activeLeaders.length})`,
          items: activeLeaders,
          disabled: isGroupInactive,
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
