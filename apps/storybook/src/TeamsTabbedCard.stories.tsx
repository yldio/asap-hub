import { TeamsTabbedCard } from '@asap-hub/react-components';
import { createListTeamResponse } from '@asap-hub/fixtures';
import { number, text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Teams Tabbed Card',
  component: TeamsTabbedCard,
};

export const Normal = () => (
  <TeamsTabbedCard
    teams={createListTeamResponse(number('Teams', 10)).items.map(
      (team, index) => ({
        ...team,
        inactiveSince: index === 2 ? '2021-01-01' : undefined,
      }),
    )}
    title={text('Title', 'Interest Group Teams')}
    disableActiveTab={false}
  />
);
export const ActiveTabDisabled = () => (
  <TeamsTabbedCard
    teams={createListTeamResponse(number('Teams', 10)).items}
    title={text('Title', 'Interest Group Teams')}
    disableActiveTab={true}
  />
);
