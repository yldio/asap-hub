import { createListInterestGroupResponse } from '@asap-hub/fixtures';
import { UserInterestGroupCard } from '@asap-hub/react-components';
import { boolean, number, text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / User Interest Group Card',
};

export const Normal = () => (
  <UserInterestGroupCard
    id="userId"
    alumniSinceDate={boolean('is alumni', false) ? '2020-01-01' : undefined}
    displayName={text('Display Name', 'John Doe')}
    groups={
      createListInterestGroupResponse(number('Number of groups', 10)).items
    }
  />
);
