import { TeamInterestGroupsTabbedCard } from '@asap-hub/react-components';
import { createListInterestGroupResponse } from '@asap-hub/fixtures';
import { number, text, boolean } from './knobs';

export default {
  title: 'Organisms / Team Interest Groups Tabbed Card',
  component: TeamInterestGroupsTabbedCard,
};

export const Normal = () => (
  <TeamInterestGroupsTabbedCard
    interestGroups={createListInterestGroupResponse(number('Groups', 3)).items}
    title={text('Title', 'Team Groups')}
    isTeamInactive={boolean('Inactive date', false)}
  />
);
