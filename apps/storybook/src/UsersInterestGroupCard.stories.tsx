import { createListGroupResponse } from '@asap-hub/fixtures';
import { UserInterestGroupCard } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / User Interest Group Card',
};

export const Normal = () => (
  <UserInterestGroupCard
    displayName="Octavian"
    groups={createListGroupResponse(number('Number of groups', 10)).items}
  />
);
export const Alumni = () => (
  <UserInterestGroupCard
    alumniSinceDate="2020-01-01"
    displayName="OctavianAlumni"
    groups={createListGroupResponse(number('Number of groups', 10)).items}
  />
);
