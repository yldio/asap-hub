import { WorkingGroupLeader, WorkingGroupMember } from '@asap-hub/model';
import { css } from '@emotion/react';
import React from 'react';
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
};

const GroupLeadersTabbedCard: React.FC<GroupLeadersTabbedCardProps> = ({
  leaders,
  members,
}) => {
  const [leaderActiveTab, setLeaderActiveTab] = React.useState(0);
  const [memberActiveTab, setMemberActiveTab] = React.useState(0);

  const [inactiveLeaders, activeLeaders] = splitListBy(
    leaders,
    (leader) => !!leader?.user?.alumniSinceDate,
  );

  const [inactiveMembers, activeMembers] = splitListBy(
    members,
    (member) => !!member?.user?.alumniSinceDate,
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
        <TabButton
          active={leaderActiveTab === 0}
          onClick={() => {
            setLeaderActiveTab(0);
          }}
        >
          Active Leaders ({activeLeaders.length})
        </TabButton>
        <TabButton
          active={leaderActiveTab === 1}
          onClick={() => {
            setLeaderActiveTab(1);
          }}
          disabled={inactiveLeaders.length === 0}
        >
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
        <TabButton
          active={memberActiveTab === 0}
          onClick={() => {
            setMemberActiveTab(0);
          }}
        >
          Active Members ({activeMembers.length})
        </TabButton>
        <TabButton
          active={memberActiveTab === 1}
          onClick={() => {
            setMemberActiveTab(1);
          }}
          disabled={inactiveMembers.length === 0}
        >
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
