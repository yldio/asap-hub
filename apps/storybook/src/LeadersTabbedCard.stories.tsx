import { LeadersTabbedCard } from '@asap-hub/react-components';
import { createUserResponse } from '@asap-hub/fixtures';
import { number, text } from '@storybook/addon-knobs';
import { GroupRole } from '@asap-hub/model';

export default {
  title: 'Organisms / Leaders Tabbed Card',
  component: LeadersTabbedCard,
};

export const Normal = () => (
  <LeadersTabbedCard
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
    title={text('Title', 'Interest Group Teams')}
    disableActiveTab={false}
  />
);

export const ActiveTabDisabled = () => (
  <LeadersTabbedCard
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
    title={text('Title', 'Interest Group Teams')}
    disableActiveTab
  />
);
