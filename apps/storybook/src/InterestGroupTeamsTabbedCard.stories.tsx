import { InterestGroupTeamsTabbedCard } from '@asap-hub/react-components';
import { createListTeamResponse } from '@asap-hub/fixtures';
import { number, boolean } from './knobs';

export default {
  title: 'Organisms / Interest Group Teams Tabbed Card',
  component: InterestGroupTeamsTabbedCard,
};

export const Normal = () => (
  <InterestGroupTeamsTabbedCard
    teams={createListTeamResponse(number('Teams', 10)).items.map(
      (team, index) => ({
        ...team,
        inactiveSince: index === 2 ? '2021-01-01' : undefined,
      }),
    )}
    isInterestGroupActive={boolean('Is Group Inactive?', false)}
  />
);
