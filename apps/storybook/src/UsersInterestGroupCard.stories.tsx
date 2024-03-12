import { createListInterestGroupResponse } from '@asap-hub/fixtures';
import { UserInterestGroupCard } from '@asap-hub/react-components';
import { boolean, number } from './knobs';

export default {
  title: 'Organisms / User Interest Group Card',
};

export const Normal = () => (
  <UserInterestGroupCard
    id="userId"
    alumniSinceDate={boolean('is alumni', false) ? '2020-01-01' : undefined}
    interestGroups={
      createListInterestGroupResponse(number('Number of groups', 10)).items
    }
  />
);
