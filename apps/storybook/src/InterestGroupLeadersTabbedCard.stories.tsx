import { InterestGroupLeadersTabbedCard } from '@asap-hub/react-components';
import { createUserResponse } from '@asap-hub/fixtures';
import { InterestGroupRole } from '@asap-hub/model';

import { number, boolean } from './knobs';

export default {
  title: 'Organisms / Interest Group Leaders Tabbed Card',
  component: InterestGroupLeadersTabbedCard,
};

export const Normal = () => (
  <InterestGroupLeadersTabbedCard
    leaders={[
      ...Array.from(
        { length: number('Number of leaders', 2, { max: 4 }) },
        (_, index) => ({
          user: {
            ...createUserResponse({}, index),
            alumniSinceDate: index % 2 === 0 ? '2021-01-01' : undefined,
          },
          role: 'Lead PI - Chair' as InterestGroupRole,
        }),
      ),
    ]}
    isInterestGroupActive={boolean('Is Group Active?', false)}
  />
);
