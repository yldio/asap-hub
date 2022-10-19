import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

import { WorkingGroupCard } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Organisms / Working Group Card',
  component: WorkingGroupCard,
};

const item = gp2Fixtures.createWorkingGroupResponse();

export const Normal = () => <WorkingGroupCard {...item} />;
