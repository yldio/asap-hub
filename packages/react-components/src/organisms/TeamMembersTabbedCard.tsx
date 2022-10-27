import { TeamMember } from '@asap-hub/model';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { rem, tabletScreen } from '../pixels';
import { MembersList, TabbedCard } from '../molecules';
import { getUniqueCommaStringWithSuffix } from '../utils/text';
import { fern } from '../colors';

const containerStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: `${rem(32)} 0`,
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

const paragraphStyles = css({
  margin: 0,
  paddingBottom: `${rem(32)}`,
});

type TeamMembersTabbedCardProps = Pick<
  ComponentProps<typeof TabbedCard>,
  'title' | 'description'
> & {
  readonly members: ReadonlyArray<TeamMember>;
};

const TeamMembersTabbedCard: React.FC<TeamMembersTabbedCardProps> = ({
  title,
  description,
  members,
}) => (
  <TabbedCard
    title={title}
    description={description}
    activeTabIndex={1}
    tabs={[
      {
        tabTitle: 'Active Team Members (0)',
        items: [],
        truncateFrom: 8,
        disabled: true,
      },
      {
        tabTitle: `Past Team Members (${members.length})`,
        items: members,
        truncateFrom: 8,
        disabled: false,
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
        ) : (
          <p css={paragraphStyles}>There are no past team members.</p>
        )}
      </div>
    )}
  </TabbedCard>
);

export default TeamMembersTabbedCard;
