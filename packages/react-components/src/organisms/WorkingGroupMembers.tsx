import { WorkingGroupLeader, WorkingGroupMember } from '@asap-hub/model';
import { css } from '@emotion/react';
import React, { useEffect } from 'react';
import { Card, Headline3, Subtitle, TabButton } from '../atoms';
import { MembersList, TabNav } from '../molecules';
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
  leaders: ReadonlyArray<
    Pick<WorkingGroupLeader, 'user' | 'role' | 'workstreamRole'>
  >;
  members: ReadonlyArray<Pick<WorkingGroupMember, 'user' | 'workstreamRole'>>;
  isGroupActive: boolean;
};

const GroupLeadersTabbedCard: React.FC<GroupLeadersTabbedCardProps> = ({
  leaders,
  members,
  isGroupActive,
}) => {
  useEffect(() => {
    setLeaderActiveTab(isGroupActive ? 0 : 1);
    setMemberActiveTab(isGroupActive ? 0 : 1);
  }, [isGroupActive]);

  const [leaderActiveTab, setLeaderActiveTab] = React.useState(0);
  const [memberActiveTab, setMemberActiveTab] = React.useState(0);

  const [inactiveLeaders, activeLeaders] = splitListBy(
    leaders,
    (leader) => !isGroupActive || !!leader?.user?.alumniSinceDate,
  );

  const [inactiveMembers, activeMembers] = splitListBy(
    members,
    (member) => !isGroupActive || !!member?.user?.alumniSinceDate,
  );
  const currentLeaders =
    leaderActiveTab === 0 ? activeLeaders : inactiveLeaders;

  const currentMembers =
    memberActiveTab === 0 ? activeMembers : inactiveMembers;

  return (
    <Card>
      <Headline3>Working Group Members</Headline3>
      <Subtitle>Leaders</Subtitle>
      <TabNav>
        <TabButton disabled={!isGroupActive}>
          Active Leaders ({activeLeaders.length})
        </TabButton>
        <TabButton disabled={inactiveLeaders.length === 0}>
          Past Leaders ({inactiveLeaders.length})
        </TabButton>
      </TabNav>
      <div css={containerStyles}>
        <MembersList
          members={currentLeaders.map(({ user, workstreamRole }) => ({
            ...user,
            id: user?.id || '',
            firstLine: user.displayName || '',
            secondLine: workstreamRole,
            thirdLine:
              user?.teams && user?.teams?.length <= 1
                ? user?.teams
                : 'Multiple Teams',
          }))}
        />
      </div>
      <Subtitle>Members</Subtitle>
      <TabNav>
        <TabButton disabled={!isGroupActive}>
          Active Members ({activeMembers.length})
        </TabButton>
        <TabButton disabled={inactiveLeaders.length === 0}>
          Past Members ({inactiveMembers.length})
        </TabButton>
      </TabNav>
      <div css={containerStyles}>
        <MembersList
          members={currentMembers
            .filter((member) => member.user !== undefined)
            .map(({ user, workstreamRole }) => ({
              ...user,
              id: user?.id || '',
              firstLine: user.displayName || '',
              secondLine: workstreamRole,
              thirdLine:
                user?.teams && user?.teams?.length <= 1
                  ? user.teams
                  : 'Multiple Teams',
            }))}
        />
      </div>
    </Card>
  );
};

export default GroupLeadersTabbedCard;
