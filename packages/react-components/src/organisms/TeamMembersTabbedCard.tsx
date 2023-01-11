import { TeamMember } from '@asap-hub/model';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { rem, tabletScreen } from '../pixels';
import { MembersList, TabbedCard } from '../molecules';
import { getUniqueCommaStringWithSuffix } from '../utils/text';
import { fern } from '../colors';
import { splitListBy } from '../utils';
import { Paragraph } from '../atoms';

const containerStyles = css({
  listStyle: 'none',
  margin: 0,
  paddingTop: `${rem(32)}`,
  display: 'grid',
  rowGap: rem(24),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    columnGap: rem(15),
  },
});

const nameStyles = css({
  color: fern.rgb,
  fontWeight: 'normal',
});

type TeamMembersTabbedCardProps = Pick<
  ComponentProps<typeof TabbedCard>,
  'title' | 'description'
> & {
  readonly members: ReadonlyArray<TeamMember>;
  readonly isTeamInactive: boolean;
};

const TeamMembersTabbedCard: React.FC<TeamMembersTabbedCardProps> = ({
  title,
  description,
  members,
  isTeamInactive,
}) => {
  const [pastMembers, activeMembers] = splitListBy(
    members,
    (member: TeamMember) =>
      isTeamInactive ||
      !!member?.alumniSinceDate ||
      member.status === 'Inactive',
  );

  return (
    <TabbedCard
      title={title}
      description={description}
      activeTabIndex={isTeamInactive ? 1 : 0}
      tabs={[
        {
          tabTitle: `Active Team Members (${
            isTeamInactive ? 0 : activeMembers.length
          })`,
          items: isTeamInactive ? [] : activeMembers,
          truncateFrom: 8,
          disabled: isTeamInactive,
          empty: (
            <Paragraph accent="lead">
              There are no active team members.
            </Paragraph>
          ),
        },
        {
          tabTitle: `Past Team Members (${
            isTeamInactive ? members.length : pastMembers.length
          })`,
          items: isTeamInactive ? members : pastMembers,
          truncateFrom: 8,
          disabled: pastMembers.length === 0,
          empty: (
            <Paragraph accent="lead">There are no past team members.</Paragraph>
          ),
        },
      ]}
      getShowMoreText={(showMore) =>
        `View ${showMore ? 'Less' : 'More'} Members`
      }
    >
      {({ data }) => (
        <div css={containerStyles}>
          <MembersList
            members={data.map(
              ({
                displayName,
                role,
                labs = [],
                avatarUrl,
                firstName,
                lastName,
                id,
                alumniSinceDate,
              }) => ({
                firstLine: displayName,
                secondLine: role,
                thirdLine: getUniqueCommaStringWithSuffix(
                  labs.map((lab) => lab.name),
                  'Lab',
                ),
                avatarUrl,
                firstName,
                lastName,
                id,
                alumniSinceDate,
              }),
            )}
            overrideNameStyles={nameStyles}
          />
        </div>
      )}
    </TabbedCard>
  );
};

export default TeamMembersTabbedCard;
