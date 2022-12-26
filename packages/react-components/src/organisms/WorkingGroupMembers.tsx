import { WorkingGroupLeader, WorkingGroupMember } from '@asap-hub/model';
import { css } from '@emotion/react';
import React from 'react';
import { Card, Headline3, Paragraph, Subtitle } from '../atoms';
import { MembersList, TabbedContent } from '../molecules';
import { rem, tabletScreen } from '../pixels';
import { splitListBy } from '../utils';

const containerStyles = css({
  padding: `${rem(33)} ${rem(33)} 0 ${rem(33)}`,
  display: 'grid',
  rowGap: rem(12),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    columnGap: rem(15),
  },
});

type LeaderListProps = {
  data: WorkingGroupLeader[];
};

type MemberListProps = {
  data: WorkingGroupMember[];
};

type GroupLeadersTabbedCardProps = {
  leaders: ReadonlyArray<
    Pick<WorkingGroupLeader, 'user' | 'role' | 'workstreamRole'>
  >;
  members: ReadonlyArray<Pick<WorkingGroupMember, 'user'>>;
  isComplete: boolean;
};

const GroupLeadersTabbedCard: React.FC<GroupLeadersTabbedCardProps> = ({
  leaders,
  members,
  isComplete,
}) => {
  const [inactiveLeaders, activeLeaders] = splitListBy(
    leaders,
    (leader) => isComplete || !!leader?.user?.alumniSinceDate,
  );

  const [inactiveMembers, activeMembers] = splitListBy(
    members,
    (member) => isComplete || !!member?.user?.alumniSinceDate,
  );

  return (
    <Card padding={false}>
      <div css={containerStyles}>
        <Headline3>Working Group Members</Headline3>
        <Subtitle>Leaders</Subtitle>
      </div>
      <TabbedContent
        activeTabIndex={isComplete ? 1 : 0}
        tabs={[
          {
            tabTitle: `Active Leaders (${activeLeaders.length})`,
            items: activeLeaders,
            disabled: isComplete,
            empty: (
              <Paragraph accent="lead">There are no active leaders.</Paragraph>
            ),
          },
          {
            tabTitle: `Past Leaders (${inactiveLeaders.length})`,
            items: inactiveLeaders,
            empty: (
              <Paragraph accent="lead">There are no past leaders.</Paragraph>
            ),
          },
        ]}
      >
        {({ data }: LeaderListProps) => (
          <div css={containerStyles}>
            <MembersList
              members={data
                .filter((member) => member.user !== undefined)
                .map(({ user, workstreamRole }) => ({
                  ...user,
                  id: user?.id || '',
                  firstLine: user.displayName || '',
                  secondLine: workstreamRole,
                }))}
            />
          </div>
        )}
      </TabbedContent>
      <div css={containerStyles}>
        <Subtitle>Members</Subtitle>
      </div>
      <TabbedContent
        activeTabIndex={isComplete ? 1 : 0}
        tabs={[
          {
            tabTitle: `Active Members (${activeMembers.length})`,
            items: activeMembers,
            truncateFrom: 8,
            disabled: isComplete,
            empty: (
              <Paragraph accent="lead">There are no active members.</Paragraph>
            ),
          },
          {
            tabTitle: `Past Members (${inactiveMembers.length})`,
            items: inactiveMembers,
            truncateFrom: 8,
            empty: (
              <Paragraph accent="lead">There are no past members.</Paragraph>
            ),
          },
        ]}
        getShowMoreText={(showMore: boolean) =>
          `View ${showMore ? 'Less' : 'More'} Members`
        }
      >
        {({ data }: MemberListProps) => (
          <div css={containerStyles}>
            <MembersList
              members={data
                .filter((member) => member.user !== undefined)
                .map(({ user }) => ({
                  ...user,
                  id: user?.id || '',
                  firstLine: user.displayName || '',
                }))}
            />
          </div>
        )}
      </TabbedContent>
    </Card>
  );
};

export default GroupLeadersTabbedCard;
