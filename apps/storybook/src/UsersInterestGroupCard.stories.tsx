import { createListGroupResponse } from '@asap-hub/fixtures';
import { UserInterestGroupCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / User Interest Group Card',
};

export const Normal = () => <UserInterestGroupCard groups={createListGroupResponse(10).items}/>;