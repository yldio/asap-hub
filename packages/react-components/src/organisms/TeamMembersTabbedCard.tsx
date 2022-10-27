import { TeamMember } from '@asap-hub/model';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { MembersList, TabbedCard } from '../molecules';
import { rem, tabletScreen } from '../pixels';
import { getUniqueCommaStringWithSuffix } from '../utils/text';

const containerStyles = css({
  listStyle: 'none',
  margin: 0,
  paddingTop: `${rem(32)}`,
  display: 'grid',
  rowGap: rem(12),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    columnGap: rem(15),
  },
});

const paragraphStyles = css({
  margin: 0,
  paddingBottom: `${rem(32)}`,
});

type TeamMembersTabbedCardProps = Pick<
  ComponentProps<typeof TabbedCard>,
  'title'
> & {
  teamMembers: ReadonlyArray<TeamMember>;
};

const TeamMembersTabbedCard: React.FC<TeamMembersTabbedCardProps> = ({
  title,
  teamMembers,
}) => (
  <TabbedCard
    title={title}
    activeTabIndex={1}
    tabs={[
      {
        tabTitle: 'Active Team Members (0)',
        items: [],
        disabled: true,
      },
      {
        tabTitle: `Past Team Members (${teamMembers.length})`,
        items: teamMembers,
        truncateFrom: 8,
      },
    ]}
    getShowMoreText={(showMore) => `View ${showMore ? 'Less' : 'More'} Members`}
  >
    {({ data }) => (
      <div css={containerStyles}>
        {data.length > 0 ? (
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
              }),
            )}
          />
        ) : (
          <p css={paragraphStyles}>There are no past team members.</p>
        )}
      </div>
    )}
  </TabbedCard>
);

export default TeamMembersTabbedCard;
