import { css } from '@emotion/react';
import React from 'react';

import { WorkingGroupMembership } from '@asap-hub/model';
import { TabbedCard, WorkingGroupsList } from '../molecules';
import { rem, tabletScreen } from '../pixels';
import { splitListBy } from '../utils';
import { Paragraph } from '../atoms';

const containerStyles = css({
  padding: `${rem(32)} 0`,
  display: 'grid',
  rowGap: rem(12),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    columnGap: rem(15),
  },
});

type WorkingGroupsTabbedCardProps = {
  groups?: ReadonlyArray<WorkingGroupMembership>;
  isUserAlumni: boolean;
};

const WorkingGroupsTabbedCard: React.FC<WorkingGroupsTabbedCardProps> = ({
  groups,
  isUserAlumni,
}) => {
  if (!groups) return null;

  const [activeMemberships, inactiveMemberships] = splitListBy(
    groups,
    (group) => group.active,
  );

  return (
    <TabbedCard
      title="Working Groups"
      description={
        <Paragraph noMargin accent="lead" styles={css({ margin: '0 0 8px' })}>
          Working groups allow CRN members to work together to solve problems.
          Find out the membership status of this member.
        </Paragraph>
      }
      activeTabIndex={isUserAlumni ? 1 : 0}
      getShowMoreText={(showMore) =>
        `View ${showMore ? 'Less' : 'More'} Memberships`
      }
      tabs={[
        {
          tabTitle: `Active Memberships (${activeMemberships.length})`,
          items: activeMemberships,
          disabled: isUserAlumni,
          empty: 'There are no active memberships.',
          truncateFrom: 6,
        },
        {
          tabTitle: `Past Memberships (${inactiveMemberships.length})`,
          items: inactiveMemberships,
          disabled: inactiveMemberships.length === 0,
          empty: 'There are no past memberships.',
          truncateFrom: 6,
        },
      ]}
    >
      {({ data }) => (
        <div css={containerStyles}>
          <WorkingGroupsList groups={data} />
        </div>
      )}
    </TabbedCard>
  );
};

export default WorkingGroupsTabbedCard;
