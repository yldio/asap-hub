import { css } from '@emotion/react';
import React from 'react';

import { WorkingGroupMembership } from '@asap-hub/model';
import { TabbedCard, WorkingGroupsList } from '../molecules';
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

type WorkingGroupsTabbedCardProps = {
  userName: string;
  groups?: ReadonlyArray<WorkingGroupMembership>;
  isUserAlumni: boolean;
};

const WorkingGroupsTabbedCard: React.FC<WorkingGroupsTabbedCardProps> = ({
  userName,
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
      title={`${userName}'s Working Groups`}
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
