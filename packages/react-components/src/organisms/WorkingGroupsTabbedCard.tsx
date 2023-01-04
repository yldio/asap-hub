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

const paragraphStyles = css({
  margin: 0,
  paddingBottom: `${rem(32)}`,
});

type WorkingGroupsTabbedCardProps = {
  userName: string;
  groups: ReadonlyArray<WorkingGroupMembership>;
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
          {data.length > 0 ? (
            <WorkingGroupsList groups={data} />
          ) : (
            <p css={paragraphStyles}>{`There are no ${
              isUserAlumni ? 'past' : 'active'
            } memberships.`}</p>
          )}
        </div>
      )}
    </TabbedCard>
  );
};

export default WorkingGroupsTabbedCard;
