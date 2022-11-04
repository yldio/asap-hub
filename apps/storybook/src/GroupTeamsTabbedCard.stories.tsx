import { GroupTeamsTabbedCard } from '@asap-hub/react-components';
import { createListTeamResponse } from '@asap-hub/fixtures';
import { number, text, boolean } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Group Teams Tabbed Card',
  component: GroupTeamsTabbedCard,
};

export const Normal = () => (
  <GroupTeamsTabbedCard
    teams={createListTeamResponse(number('Teams', 10)).items.map(
      (team, index) => ({
        ...team,
        inactiveSince: index === 2 ? '2021-01-01' : undefined,
      }),
    )}
    title={text('Title', 'Interest Group Teams')}
    isGroupInactive={boolean('Is Group Inactive?', false)}
  />
);
