import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

import { WorkingGroupNetwork } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Organisms /Working Group / Network ',
  component: WorkingGroupNetwork,
};

const props = {
  workingGroupNetwork: gp2Fixtures.createWorkingGroupNetworkResponse(),
  role: 'operational' as const,
};

export const Normal = () => <WorkingGroupNetwork {...props} />;
