import { GroupLeadersTabbedCard } from '@asap-hub/react-components';
import { createUserResponse } from '@asap-hub/fixtures';
import { number, boolean } from '@storybook/addon-knobs';
import { GroupRole } from '@asap-hub/model';

export default {
  title: 'Organisms /Group Leaders Tabbed Card',
  component: GroupLeadersTabbedCard,
};

export const Normal = () => (
  <GroupLeadersTabbedCard
    leaders={[
      ...Array.from(
        { length: number('Number of leaders', 2, { max: 4 }) },
        (_, index) => ({
          user: {
            ...createUserResponse({}, index),
            alumniSinceDate: index % 2 === 0 ? '2021-01-01' : undefined,
          },
          role: 'Lead PI - Chair' as GroupRole,
        }),
      ),
    ]}
    isGroupActive={boolean('Is Group Active?', false)}
  />
);
