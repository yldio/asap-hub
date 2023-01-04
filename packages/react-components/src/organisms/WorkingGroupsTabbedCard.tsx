import { css } from '@emotion/react';
import React from 'react';
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

type GroupMemberShip = {
  id: string;
  name: string;
  role: string;
  active: boolean;
};

type WorkingGroupsTabbedCardProps = {
  userName: string;
  groups: ReadonlyArray<GroupMemberShip>;
  isUserAlumni: boolean;
};

const WorkingGroupsTabbedCard: React.FC<WorkingGroupsTabbedCardProps> = ({
  userName,
  groups,
  isUserAlumni,
}) => {
  const [inactiveMemberships, activeMemberships] = splitListBy(
    groups,
    (group) => isUserAlumni || !group?.active,
  );

  return (
    <TabbedCard
      title={`${userName}'s Working Groups`}
      activeTabIndex={isUserAlumni ? 1 : 0}
      tabs={[
        {
          tabTitle: `Active Memberships (${activeMemberships.length})`,
          items: activeMemberships,
          disabled: isUserAlumni,
        },
        {
          tabTitle: `Past Memberships (${inactiveMemberships.length})`,
          items: inactiveMemberships,
          disabled: inactiveMemberships.length === 0,
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
