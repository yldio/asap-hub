import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

import { WorkingGroupDetailHeader } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Organisms /Working Group Detail Header ',
  component: WorkingGroupDetailHeader,
};

const item = {
  ...gp2Fixtures.createWorkingGroupResponse(),
  backHref: '/',
};

export const Normal = () => <WorkingGroupDetailHeader {...item} />;
